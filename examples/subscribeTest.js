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

        await ig.simulate.preLoginFlow();
        await ig.account.login(username, password);

        process.nextTick(async () => await ig.simulate.postLoginFlow());

        const inboxFeed = ig.feed.directInbox();
        console.log('- inboxFeed')
        console.log(inboxFeed)

        const threads = await inboxFeed.items();
        console.log('- threads')
        console.log(threads) // Conversas
        
        inboxFeed.items$.subscribe(
            data => {
                console.log('- nova mensagem')
                console.log(data)
            },
            error => console.error(error),
            () => console.log('Complete!'),
          );
    } catch (error) {
        console.log('- error')
        console.log(error)
    }
}

execTest()