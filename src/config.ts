import * as path from "path";

const isDevelopment = process.env.NODE_ENV !== "production";

import * as USER_HOME from "user-home";
// const USER_HOME = require("user-home");
const INTERNAL_PLUGIN_REPO = path.join(__dirname, "./plugins");
const MAIN_PLUGIN_REPO = path.join(USER_HOME, ".xct/plugins");

const PLUGIN_REPOS = [
  INTERNAL_PLUGIN_REPO,
  MAIN_PLUGIN_REPO,
];

export default {
  INTERNAL_PLUGIN_REPO,
  MAIN_PLUGIN_REPO,
  PLUGIN_REPOS,
};

// TODO: watch plugins directory with chokidar and reload when necessary
// const figlet = rq.plugin('xct-plugin-figlet/index.js');
// const xkcd = rq.plugin('xct-plugin-xkcd/index.js');
