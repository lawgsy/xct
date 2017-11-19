console.log('Initialized plugin-manager-plugin')

import config from '../../config'

import * as path from 'path'
import * as fse  from 'fs-extra'

interface pluginCfg {
  command?         : string,
  usage?           : string,
  example_input?   : string,
  example_output?  : string,
  prefix?          : string,
  preferences?     : string,
  readonly path    : string,
  readonly name    : string,
  readonly version : string
}

/**
 * Ensure repositories exist (created if necessary).
 */
function ensurePluginRepos() {
  for (const repo of config.PLUGIN_REPOS) fse.ensureDirSync(repo);
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

/**
 * Return plugin as function, if available
 * @param  {string}   pluginPath File path to plugin
 * @return {Function}            Plugin module
 */
function importPluginModule(pluginPath: string): Function | undefined {
  let PluginModule = null;
  try {
    PluginModule = require(pluginPath);
  } catch (e) {
    console.error(`error on loading: ${pluginPath}`);
    console.error(e.stack);
    return undefined;
  }

  if (typeof PluginModule !== "function") {
    console.error(`plugin not function: ${pluginPath}`);
    return undefined;
  }
  return PluginModule;
}

/**
 * Parse and return package.json of given plugin path as pluginCfg object
 * @param  {string}    pluginId   Unique plugin ID (directory name)
 * @param  {string}    pluginPath File path to plugin
 * @return {pluginCfg}            See interface at top of this file
 */
function parsePluginConfig(pluginId: string, pluginPath: string): pluginCfg {
  let pluginConfig: pluginCfg
  try {
    const packageJson = <any>require(path.join(pluginPath, 'package.json'));

    pluginConfig = {
      path: pluginPath,
      name: packageJson.name,
      version: packageJson.version
    }

    const xctProps = packageJson.xct;
    if (xctProps) pluginConfig = xctProps;

    const prefSchemaPath = path.join(pluginPath, 'preferences.json');
    let preferences = undefined;
    if (fse.existsSync(prefSchemaPath))
      pluginConfig.preferences = preferences;
  } catch (e) {
    console.error(`error on loading ${pluginId} configuration`, e);
    return null;
  }
  return pluginConfig;
}

/**
 * Load all plugins from all repositories defined in src/config.ts
 * @return {loadedPlugins, loadedPluginConfigs} [description]
 */
function loadPlugins() {
  const pluginPaths = getPluginPaths();
  var loadedPlugins: {
    [index: string]: Function
  } = {}
  var loadedPluginConfigs: {
    [index: string]: pluginCfg
  } = {}
  for (var pluginPath of pluginPaths) {
    if (pluginPath in loadedPlugins) {
      console.error(`conflict: ${pluginPath} is already loaded`);
      continue;
    }
    const pluginModule: Function|undefined = importPluginModule(pluginPath);
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
  return {loadedPlugins, loadedPluginConfigs};
}

module.exports = {
  loadPlugins: loadPlugins
}
