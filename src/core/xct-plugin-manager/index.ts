console.log('loading plugin-manager-plugin...')

import config from '../../config'

import * as path from 'path'
import * as fse  from 'fs-extra'

type pluginType = Function | undefined
interface pluginCfg {
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


function importPluginModule(pluginFile): pluginType {
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



function parsePluginConfig(pluginId: string, pluginPath: string): pluginCfg {
  let pluginConfig: pluginCfg = {
    path: pluginPath,
    name: pluginId,
    version: "0.0.0"
  }
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

function loadPlugins(): { [index: string]: pluginType } {
  const pluginPaths = getPluginPaths();
  var loadedPlugins: {
    [index: string]: pluginType
  } = {}
  var loadedPluginConfigs: {
    [index: string]: pluginCfg
  } = {}
  for (var pluginPath of pluginPaths) {
    if (pluginPath in loadedPlugins) {
      console.error(`conflict: ${pluginPath} is already loaded`);
      continue;
    }
    const pluginModule: pluginType = importPluginModule(pluginPath);
    if (pluginModule === undefined) continue;

    const pluginId: string = path.basename(pluginPath);
    const pluginConfig: pluginCfg = parsePluginConfig(pluginId, pluginPath);

    try {
      loadedPlugins[pluginId] = pluginModule;
      loadedPluginConfigs[pluginId] = pluginConfig;
      console.debug(`${pluginId} loaded (definitely)`);
    } catch (e) {
      console.error(`${pluginId} could'nt be created: ${e.stack || e}`);
    }
  }
  return loadedPlugins;
}

console.debug('loaded plugin-manager-plugin!')


module.exports = {
  init: init
  //, loadPlugins: loadPlugins
}
