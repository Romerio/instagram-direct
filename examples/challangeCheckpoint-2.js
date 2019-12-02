const { IgApiClient, IgCheckpointError } = require('instagram-private-api')
const Bluebird = require('bluebird')
const inquirer = require('inquirer')

const username = 'kinbox.koruja' // koruja_contato - 'kinbox.koruja';
const password = 'krjknbx84902';

(async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(username);
  ig.state.proxyUrl = process.env.IG_PROXY;
  Bluebird.try(async () => {
    const auth = await ig.account.login(username, password);
    console.log('- auth')
    console.log(auth);
  }).catch(IgCheckpointError, async () => {
    console.log(await ig.challenge.sendSecurityCode(946217));
  });
})();