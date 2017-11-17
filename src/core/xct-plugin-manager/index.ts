console.log('loading plugin-manager-plugin...')


import * as config from '../../config'
const path = require('path')

const fse = require('fs-extra')

// const rq = require('electron-require');
//
// rq.set({
//     'plugin': '%{userData}/../../../.xct/plugins'
// });

// TODO: watch plugins directory with chokidar and reload when necessary
// const figlet = rq.plugin('xct-plugin-figlet/index.js');
// const xkcd = rq.plugin('xct-plugin-xkcd/index.js');

function init() {
  loadPlugins();
}

/**
 * Ensure repositories exist (created if necessary).
 */
function ensurePluginRepos() {//: void {
  for (const repo of config.PLUGIN_REPOS) {
    fse.ensureDirSync(repo);
  }
}

/**
 * Return plugin paths from repositories specified in src/config.js
 * @return {string[]} Array of plugin paths
 */
function getPluginPaths(): string[] {
  ensurePluginRepos();

  var files: string[] = []
  for (const repo of config.PLUGIN_REPOS) {
    try {
      // pluginPerRepo[repo] = fse.readdirSync(repo)
      files = files.concat(
                fse.readdirSync(repo)
                    .map((pluginDir: string) => path.join(repo, pluginDir)
                )
              )
    } catch (e) {
      console.error(e)
    }
  }
  return files;
}

function importPluginModule(pluginFile): Function|undefined {
  let PluginModule = null;
  try {
    PluginModule = require(pluginFile);
  } catch (e) {
    console.error(`error on loading: ${pluginFile}`);
    console.error(e.stack);
    return undefined;
  }

  if (typeof PluginModule !== "function") {
    console.error(`plugin not function: ${pluginFile}`);
    return undefined;
  }
  return PluginModule;
}

function parsePluginConfig(pluginId, pluginPath) {
  let pluginConfig: {
    command?       : string,
    usage?         : string,
    example_input? : string,
    example_output?: string,
    prefix?        : string,
    preferences?   : string,
    path           : string,
    name           : string,
    version        : string
  }
  pluginConfig = { path: pluginPath, name: pluginId, version: "0.0.0" }
  try {
    const packageJson = <any>require(path.join(pluginPath, 'package.json'));
    const prefSchemaPath = path.join(pluginPath, 'preferences.json');
    let preferences = undefined;
    if (fse.existsSync(prefSchemaPath))
      pluginConfig.preferences = preferences;

    const xctProps = packageJson.xct;
    if (xctProps) {
      pluginConfig = xctProps;
    }
    pluginConfig.name    = packageJson.name;
    pluginConfig.version = packageJson.version;
  } catch (e) {
    console.error(`error on loading ${pluginId} config`, e);
    return null;
  }
  return pluginConfig;
}

function loadPlugins() {
  const pluginPaths = getPluginPaths();
  var loadedPlugins: {[index:string]: any} = {}//: any = {};
  for (var pluginPath of pluginPaths) {
    if (pluginPath in loadedPlugins) {
      console.error(`conflict: ${pluginPath} is already loaded`);
      continue;
    }
    const PluginModule = importPluginModule(pluginPath);
    if (PluginModule === null)
      continue;
    const pluginId = path.basename(pluginPath);
    const pluginConfig = parsePluginConfig(pluginId, pluginPath);
  }
}

console.log('loaded plugin-manager-plugin!')


module.exports = {
  init: init
  //, loadPlugins: loadPlugins
}
