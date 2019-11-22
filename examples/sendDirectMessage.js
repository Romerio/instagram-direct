const { IgApiClient } = require('instagram-private-api')
//import { sample } from 'lodash';
//import { async } from 'rxjs/internal/scheduler/async';
const ig = new IgApiClient();

const username = 'koruja_contato'
const username2 = 'koruja_002'
const username3 = 'kinbox.koruja'

const password = 'krjknbx84902'

const execTest = async () => {
    try {
        const userToLogin = username2
        console.log('#0')
        ig.state.generateDevice(userToLogin);

        ig.state.proxyUrl = process.env.IG_PROXY;

        console.log('#1')

        await ig.simulate.preLoginFlow();
        const loggedInUser = await ig.account.login(userToLogin, password);

        console.log('- loggedInUser')
        console.log(loggedInUser)

        process.nextTick(async () => await ig.simulate.postLoginFlow());

        const userId = await ig.user.getIdByUsername('kinbox.koruja');

        console.log('- userId')
        console.log(userId)

        const thread = ig.entity.directThread([userId.toString()]);
        
        await thread.broadcastText('Mensagem 4 - koruja_002');

        await thread.broadcastPhoto({
            file: readFileSync('./tools/images/original.jpg'),
        })

    } catch (error) {
        console.log('- error')
        console.log(error)
    }
}

execTest()