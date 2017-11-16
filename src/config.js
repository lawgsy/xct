const path = require('path')

const isDevelopment = process.env.NODE_ENV !== 'production'

// const INTERNAL_PLUGIN_REPO = isDevelopment ? 'static/plugins' : 'resources/static/plugins';
const USER_HOME = require('user-home');
const INTERNAL_PLUGIN_REPO = path.join(__dirname, './plugins');
const MAIN_PLUGIN_REPO = path.join(USER_HOME, '.xct/plugins');
console.log(MAIN_PLUGIN_REPO);

// const MAIN_PLUGIN_REPO = path.resolve(`${XCT_USER_PATH}/plugins`);
// const DEV_PLUGIN_REPO = path.resolve(`${XCT_USER_PATH}/devplugins`);
// console.log(INTERNAL_PLUGIN_REPO)
// const rq = require('electron-require');
//
// rq.set({
//     'plugin': '%{userData}/../../../.xct/plugins'
// });
// console.dir(INTERNAL_PLUGIN_REPO)

const PLUGIN_REPOS = [
  INTERNAL_PLUGIN_REPO
, MAIN_PLUGIN_REPO
];

module.exports = {
  INTERNAL_PLUGIN_REPO
, PLUGIN_REPOS
}


//
// rq.set({
//     'plugin': '%{userData}/../../../.xct/plugins'
// });

// TODO: watch plugins directory with chokidar and reload when necessary
// const figlet = rq.plugin('xct-plugin-figlet/index.js');
// const xkcd = rq.plugin('xct-plugin-xkcd/index.js');
