const { IgApiClient, IgCheckpointError } = require('instagram-private-api')
const Bluebird = require('bluebird')
const inquirer = require('inquirer')

const username = 'koruja_contato' // 'kinbox.koruja';
const password = 'krjknbx84902';

(async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(username);
  //ig.state.proxyUrl = process.env.IG_PROXY;
  Bluebird.try(async () => {
    const auth = await ig.account.login(username, password);
    console.log('- auth')
    console.log(auth);
  }).catch(IgCheckpointError, async () => {
    console.log('- checkpoint')
    console.log(ig.state.checkpoint); // Checkpoint info here
    await ig.challenge.auto(true); // Requesting sms-code or click "It was me" button
  });
})();