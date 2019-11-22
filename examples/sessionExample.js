const { IgApiClient } = require('instagram-private-api')
//import { sample } from 'lodash';
//import { async } from 'rxjs/internal/scheduler/async';

const username1 = 'koruja_contato'
const username2 = 'kinbox.koruja'

const passwordDefault = 'krjknbx84902'

const loginClient = async ({ username, password }) => {
    try {
        const ig = new IgApiClient()

        await ig.state.generateDevice(username)
        ig.state.proxyUrl = process.env.IG_PROXY;

        await ig.simulate.preLoginFlow()
        await ig.account.login(username, password)

        await process.nextTick(async () => await ig.simulate.postLoginFlow())

        return ig
    } catch (error) {
        console.log('#error loginClient')
        throw error
    }
}

const authPlatform = async ({ username, password }) => {
    try {
        const ig = new IgApiClient()

        ig.state.generateDevice(process.env.IG_USERNAME || username)

        await ig.simulate.preLoginFlow()
        const loggedUser = await ig.account.login(process.env.IG_USERNAME || username, process.env.IG_PASSWORD || password)
        process.nextTick(async () => await ig.simulate.postLoginFlow())

        ig.state.userData = {
            pk: loggedUser.pk
        }

        return ig
    } catch (error) {
        throw error
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
            userData: userClient.state.userData
        }

        return { cookies, state }
    } catch (error) {
        console.log('#error getSession')
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
        ig.state.userData = state.userData

        return ig
    } catch (error) {
        console.log('#error restoreSession')
        throw error
    }
}

const printData = async ({ userClient }) => {
    try {
        const inboxFeed = await userClient.feed.directInbox()
        // console.log('- inboxFeed')
        // console.log(inboxFeed)

        const threads = await inboxFeed.items()
        // console.log('- threads')
        // console.log(threads) // Conversas

        console.log('\n## printData ##')
        console.log('- UserData:')
        console.log(userClient.state.userData) // Mensagens da primeira conversa da lista

        console.log('- Mensagens:', threads[0].items.length)
        console.log(threads[0].items[0]) // Mensagens da primeira conversa da lista
    } catch (error) {
        console.log('#error printData')
        throw error
    }
}

const execTest = async () => {
    try {
        const userClientOne = await authPlatform({ username: username1, password: passwordDefault })
        await printData({ userClient: userClientOne })
        const { cookies, state } = await getSession({ userClient: userClientOne })

        const userClientTwo = await authPlatform({ username: username2, password: passwordDefault })
        await printData({ userClient: userClientTwo })

        const userClientTOneRestored = await restoreSession({ cookies, state })
        await printData({ userClient: userClientTOneRestored })

    } catch (error) {
        console.log('- error')
        console.log(error)
    }
}

execTest()