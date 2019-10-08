const { IgApiClient } = require('instagram-private-api')
//import { sample } from 'lodash';
//import { async } from 'rxjs/internal/scheduler/async';
const ig = new IgApiClient();

const username = 'koruja_contato'
const password = 'krjknbx84902'

/**
 * Fluxo:
 * 
 *   - Obtenho a thread, ela já traz as últimas 10 mensagens
 *   - Se todas são mensagens novas, puxo próxima página de mensagens (timestamp pode servir de referência)
 *   - Se acabaram as mensagens ou eu trouxe uma que já tinha lido, paro de paginar
 */

const execTest = async () => {
    try {
        ig.state.generateDevice(username);
        ig.state.proxyUrl = process.env.IG_PROXY;

        await ig.simulate.preLoginFlow();
        await ig.account.login(username, password);

        process.nextTick(async () => await ig.simulate.postLoginFlow());

        const inboxFeed = await ig.feed.directInbox();

        const threads = await inboxFeed.items(); // Conversas 

        /**
         * Definir conversa a se processar
         */

        const threadToProcess = threads[0] // Uma conversa específica
        console.log('- threadToProcess')
        console.log(threadToProcess)
        console.log()

        /**
         * Paginar as mensanges da conversa
         */

        const threadFeed = await ig.feed.directThread(threadToProcess);

        console.log('- threadFeed')
        console.log(threadFeed)
        console.log()

        const page1 = await threadFeed.items()
        console.log('- page1')
        console.log(page1)
        console.log()

        const page2 = await threadFeed.items()
        console.log('- page2')
        console.log(page2)
        console.log()

    } catch (error) {
        console.log('- error')
        console.log(error)
    }
}

execTest()