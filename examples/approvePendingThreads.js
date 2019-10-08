const { IgApiClient } = require('instagram-private-api')
//import { sample } from 'lodash';
//import { async } from 'rxjs/internal/scheduler/async';
const ig = new IgApiClient();

const username = 'kinbox.koruja@gmail.com'
const password = 'krjknbx84902'

const execTest = async () => {
    try {
        ig.state.generateDevice(username);
        ig.state.proxyUrl = process.env.IG_PROXY;

        await ig.simulate.preLoginFlow();
        await ig.account.login(username, password);

        process.nextTick(async () => await ig.simulate.postLoginFlow());

        const directPending = ig.feed.directPending();
        console.log('- directPending')
        console.log(directPending)

        const items = await directPending.items();
        console.log('- items')
        console.log(items) // Conversas

        const thread_ids = items.map(item => item.thread_id)
        console.log('- thread_ids')
        console.log(thread_ids)

        const result = await ig.directThread.approveMultiple(thread_ids);
        console.log('- result')
        console.log(result)
    } catch (error) {
        console.log('- error')
        console.log(error)
    }
}

execTest()