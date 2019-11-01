const { IgApiClient } = require('instagram-private-api')
//import { sample } from 'lodash';
//import { async } from 'rxjs/internal/scheduler/async';

const username = 'koruja_contato'
const username2 = 'kinbox.koruja@gmail.com'

const password = 'krjknbx84902'

const firstLogin = async ({}) => {
    try {
        const userToLogn = username
        const ig = new IgApiClient()

        ig.state.generateDevice(userToLogn);
        ig.state.proxyUrl = process.env.IG_PROXY;

        await ig.simulate.preLoginFlow();
        await ig.account.login(userToLogn, password);

        process.nextTick(async () => await ig.simulate.postLoginFlow());

        const inboxFeed = ig.feed.directInbox();
        // console.log('- inboxFeed')
        // console.log(inboxFeed)

        const threads = await inboxFeed.items();
        // console.log('- threads')
        // console.log(threads) // Conversas

        console.log('- Mensagens:', threads[0].items.length)
        console.log(threads[0].items[0]) // Mensagens da primeira conversa da lista

        return ig
    } catch (error) {
        console.log('- error 1')
        console.log(error)
    }
}

const getSession = async ({ userClient }) => {
    try {
        const cookies = await userClient.state.serializeCookieJar()
        const state = {
            deviceString: userClient.state.deviceString,
            deviceId: userClient.state.deviceId,
            uuid: userClient.state.uuid,
            phoneId: userClient.state.phoneId,
            adid: userClient.state.adid,
            build: userClient.state.build,
        }

        return { cookies, state }
    } catch (error) {
        throw error
    }
}

const restoreSession = async ({ cookies, state }) => {
    try {
        const ig = new IgApiClient()

        await ig.state.deserializeCookieJar(JSON.stringify(cookies))
        ig.state.deviceString = state.deviceString
        ig.state.deviceId = state.deviceId
        ig.state.uuid = state.uuid
        ig.state.phoneId = state.phoneId
        ig.state.adid = state.adid
        ig.state.build = state.build

        return ig
    } catch (error) {
        console.log('- error 2')
        console.log(error)
    }
}

const execTest = async () => {
    try {
        const userClient = await firstLogin({})

        const { cookies, state } = await getSession({ userClient })

        const userClientTwo = await restoreSession({ cookies, state })

        const inboxFeed = userClientTwo.feed.directInbox();
        // console.log('- inboxFeed')
        // console.log(inboxFeed)

        const threads = await inboxFeed.items();
        // console.log('- threads')
        // console.log(threads) // Conversas

        console.log('- Mensagens:', threads[0].items.length)
        console.log(threads[0].items[0]) // Mensagens da primeira conversa da lista

    } catch (error) {
        console.log('- error')
        console.log(error)
    }
}

execTest()