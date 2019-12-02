const { IgApiClient } = require('instagram-private-api')
//import { sample } from 'lodash';
//import { async } from 'rxjs/internal/scheduler/async';
const ig = new IgApiClient();

const username = 'koruja_contato'
const username2 = 'kinbox.koruja@gmail.com'

const password = 'krjknbx84902'

const receiveMessages = async () => {
    try {
        ig.state.generateDevice(username2);
        ig.state.proxyUrl = process.env.IG_PROXY;

        await ig.simulate.preLoginFlow();
        await ig.account.login(username, password);

        process.nextTick(async () => await ig.simulate.postLoginFlow());

        const inboxFeed = ig.feed.directInbox();
        console.log('- inboxFeed')
        console.log(inboxFeed)

        const threads = await inboxFeed.items();
        console.log('- threads')
        console.log(threads) // Conversas

        console.log('- Mensagens:', threads[0].items.length)
        console.log(threads[0].items) // Mensagens da primeira conversa da lista
    } catch (error) {
        /*console.log('- error')
        console.log(Object.keys(error))
        console.log(error)*/

        throw error
    }
}

const handleErros = ({ error }) => {
    try {
        const errorString = error.toString()

        if (errorString.includes('challenge_required')) {
            throw new Error('Por favor, utilize o código de autenticação para logar com sua conta.')
        }

        throw error
    } catch (e) {
        console.log('ERROR:')
        console.log(Object.keys(e))
        console.log(e)
    }
}

const execTest = async () => {
    try {
        const result = await receiveMessages()
    } catch (error) {
        handleErros({ error })
    }
}

execTest()