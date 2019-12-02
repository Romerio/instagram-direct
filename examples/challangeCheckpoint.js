const { IgApiClient, IgCheckpointError } = require('instagram-private-api')
const Bluebird = require('bluebird')
const inquirer = require('inquirer')

<<<<<<< HEAD
//const username = 'koruja_002' //  koruja_contato - 'kinbox.koruja';
//const username = 'kinbox.koruja' // 'kinbox.koruja';
//const password = 'krjknbx84902';

const username = 'ganhomaisapp' // 'kinbox.koruja';
const password = '123456teste';

// const username = 'andrewcsz' // 'kinbox.koruja';
// const password = 'koruja@12345';

(async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(username);
  // ig.state.proxyUrl = 'http://218.250.246.190:3128' // process.env.IG_PROXY;
  Bluebird.try(async () => {

   // await ig.simulate.preLoginFlow()

    const auth = await ig.account.login(username, password);
    
    //process.nextTick(async () => await ig.simulate.postLoginFlow())
=======
//const username = 'koruja_002' // 'kinbox.koruja';
const username = 'koruja_002' // koruja_contato - kinbox.koruja - koruja_002
const password = 'krjknbx84902';

(async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice('username');
  ig.state.proxyUrl = process.env.IG_PROXY;
  Bluebird.try(async () => {

    // await ig.simulate.preLoginFlow()

    const auth = await ig.account.login(username, password);

    // process.nextTick(async () => await ig.simulate.postLoginFlow())
>>>>>>> c811df035a0f5162c5df41ceb19e7710a170a962

    console.log('- auth')
    console.log(auth);
  }).catch(IgCheckpointError, async () => {
    console.log('- checkpoint')
    console.log(ig.state.checkpoint); // Checkpoint info here
    await ig.challenge.auto(true); // Requesting sms-code or click "It was me" button
    console.log(ig.state.checkpoint); // Challenge info here

    console.log('- code input')
    const { code } = await inquirer.prompt([
      {
        type: 'input',
        name: 'code',
        message: 'Enter code',
      },
    ]);
    console.log('- result')
    console.log(await ig.challenge.sendSecurityCode(code));
  });
})();