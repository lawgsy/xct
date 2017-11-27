console.log("Initialized pluginmanager");

import config from "../../config";

import * as fse from "fs-extra";
import * as path from "path";

interface IPluginCfg {
  command?: string;
  usage?: string;
  template?: string;
  example_output?: string;
  prefix?: string;
  preferences?: string;
  live?: boolean;
  description: string;
  readonly path: string;
  readonly name: string;
  readonly version: string;
}

type pluginFunc = (context: any, input: string) => Promise<{}> | undefined;

/**
 * Ensure repositories exist (created if necessary).
 */
function ensurePluginRepos() {
  for (const repo of config.PLUGIN_REPOS)
    fse.ensureDirSync(repo);
}

/**
 * Return plugin paths from repositories specified in src/config.js
 * @return {string[]} Array of plugin paths
 */
function getPluginPaths(): string[] {
  ensurePluginRepos();

  let files: string[] = [];
  for (const repo of config.PLUGIN_REPOS) {
    try {
      files = files.concat(fse.readdirSync(repo)
                              .map((pluginDir) => path.join(repo, pluginDir)));
    } catch (e) {
      console.error(e);
    }
  }
  return files;
}

/**
 * Return plugin as function, if available
 * @param  {string}   pluginPath File path to plugin
 * @return {Function}            Plugin module
 */
function importPluginModule(pluginPath: string): pluginFunc {
  let loadedPlugin: pluginFunc;
  try {
    loadedPlugin = require(pluginPath);
  } catch (e) {
    console.error(`error on loading: ${pluginPath}`);
    console.error(e.stack);
    loadedPlugin = undefined;
  }

  if (typeof loadedPlugin !== "function") {
    console.error(`'${pluginPath}' is not a function (${typeof loadedPlugin})`);
    loadedPlugin = undefined;
  }
  return loadedPlugin;
}

/**
 * Parse and return package.json of given plugin path as pluginCfg object
 * @param  {string}    pluginId   Unique plugin ID (directory name)
 * @param  {string}    pluginPath File path to plugin
 * @return {pluginCfg}            See interface at top of this file
 */
function parsePluginConfig(pluginId: string, pluginPath: string): IPluginCfg {
  let pluginConfig: IPluginCfg;
  try {
    const packageJson = require(path.join(pluginPath, "package.json")) as any;

    pluginConfig = {
      path: pluginPath,
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
    };

    const xctProps = packageJson.xct;
    if (xctProps)
      pluginConfig = (Object as any).assign(xctProps, pluginConfig);

    // const prefSchemaPath = path.join(pluginPath, "preferences.json");
    // let preferences = undefined;
    // if (fse.existsSync(prefSchemaPath))
    //   pluginConfig.preferences = preferences;
  } catch (e) {
    console.error(`Error on loading ${pluginId} configuration`, e);
    return undefined;
  }
  return pluginConfig;
}

/**
 * Load all plugins from all repositories defined in src/config.ts
 * @return {loadedPlugins, loadedPluginConfigs} [description]
 */
function loadPlugins() {
  const pluginPaths = getPluginPaths();
  const loadedPlugins: { [index: string]: pluginFunc } = {};
  const loadedPluginConfigs: { [index: string]: IPluginCfg } = {};
  for (const pluginPath of pluginPaths) {
    const pluginId: string = path.basename(pluginPath);
    if (pluginId in loadedPlugins) {
      console.error(`Conflict: ${pluginPath} is already loaded`);
    } else {
      const loadedPlugin = importPluginModule(pluginPath);
      if (loadedPlugin !== undefined) {
        const pluginConfig = parsePluginConfig(pluginId, pluginPath);

        loadedPlugins[pluginId] = loadedPlugin;
        loadedPluginConfigs[pluginId] = pluginConfig;
      }
    }
  }
  return {loadedPlugins, loadedPluginConfigs};
}

export { loadPlugins };
