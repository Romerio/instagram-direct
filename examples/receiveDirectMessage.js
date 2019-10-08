const { IgApiClient } = require('instagram-private-api')
//import { sample } from 'lodash';
//import { async } from 'rxjs/internal/scheduler/async';
const ig = new IgApiClient();

const username = 'koruja_contato'
const username2 = 'kinbox.koruja@gmail.com'

const password = 'krjknbx84902'

const execTest = async () => {
    try {
        ig.state.generateDevice(username2);
        ig.state.proxyUrl = process.env.IG_PROXY;

        await ig.simulate.preLoginFlow();
        await ig.account.login(username2, password);

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
        console.log('- error')
        console.log(error)
    }
}

execTest()