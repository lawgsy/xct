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

  // function pickPluginModule(pluginPath: string, pluginName: string) {
  //   var req = require.context(pluginPath, true, /^.*$/);
  //
  //   req.resolve("./"+pluginName);//var tableTemplate =
  //   // function requireAll(requireContext: any) {
  //   //   return requireContext.keys().map(requireContext);
  //   // }
  //   // // requires and returns all modules that match
  //   //
  //   // var modules = requireAll(require.context("./spec", true, /^\.\/.*\.js$/));
  //   // let PluginModule = null;
  //   // try {
  //   //   PluginModule = require(pluginPath);
  //   // } catch (e) {
  //   //   console.error(`error on loading: ${pluginPath}`);
  //   //   console.error(e.stack);
  //   // }
  //   //
  //   // if (typeof PluginModule !== "function") {
  //   //   console.error(`plugin not function: ${pluginPath}`);
  //   //   return null;
  //   // }
  //   // return PluginModule;
  // }
function pickPluginModule(pluginFile): Function|undefined {
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

// function parsePluginConfig(pluginId, pluginFile) {
//   let pluginConfig = {};
//   try {
//     const packageJson = require(path.join(pluginFile, 'package.json'));
//     const prefSchemaPath = path.join(pluginFile, 'preferences.json');
//     const prefSchemaFallbackPath = path.join(pluginFile, 'preferences.js');
//     let prefSchema = null;
//     if (fs.existsSync(prefSchemaPath))
//       prefSchema = require(prefSchemaPath);
//     else if (fs.existsSync(prefSchemaFallbackPath))
//       prefSchema = require(prefSchemaFallbackPath);
//
//     const hainProps = packageJson.hain;
//     if (hainProps) {
//       pluginConfig = lo_assign(pluginConfig, hainProps);
//       pluginConfig.path = pluginFile;
//       pluginConfig.usage = pluginConfig.usage || pluginConfig.prefix;
//       pluginConfig.redirect = pluginConfig.redirect || pluginConfig.prefix;
//       pluginConfig.icon = iconFmt.parse(pluginFile, pluginConfig.icon);
//       pluginConfig.group = pluginConfig.group || pluginId;
//     }
//     pluginConfig.prefSchema = prefSchema;
//     pluginConfig.name = packageJson.name;
//     pluginConfig.version = packageJson.version;
//   } catch (e) {
//     logger.error(`error on loading ${pluginId} config`);
//     logger.error(e);
//     return null;
//   }
//   return pluginConfig;
// }

function loadPlugins() {
  const pluginPaths = getPluginPaths();
  // console.log(pluginPaths[0])
  // // const plugins: {[index: string]: any} = {};
  // // const pluginConfigs = {};
  // // const xkcd = require('../plugins/xct-plugin-xkcd')
  // // const xkcd = require('../../static/plugins/xct-plugin-xkcd')
  //
  // // require(path.join(__static,'plugins/xct-plugin-figlet'))
  var loadedPlugins: {[index:string]: any} = {}//: any = {};
  for (var pluginPath of pluginPaths) {
    console.log(pluginPath)
    if (pluginPath in loadedPlugins) {
      console.error(`conflict: ${pluginPath} is already loaded`);
      continue;
    }
    const PluginModule = pickPluginModule(pluginPath);
    if (PluginModule === null)
      continue;
    const pluginId = path.basename(pluginPath);
    // const pluginConfig = parsePluginConfig(pluginId, pluginPath);
    // console.log('loading plugin',pluginId)
    //   // const pluginConfig = parsePluginConfig(pluginId, pluginPath);
    //   // if (pluginConfig === null)
    //   //   continue;
  }
  //   for (var pluginName of pluginPerRepo[repo]) {
  //     console.log(path.join(repo,pluginName))
  //     loaded[pluginName] = require(path.join(repo,pluginName))
  //     // break;
  //     // require(repo+'/'+pluginName);
  //   }
  //   //   //   console.error(`conflict: ${pluginName} is already loaded`);
  //   //   //   continue;
  //   //   // }
  // }
  // return loaded;
  // //   // var [pluginPath, pluginName] = pluginPathName
  // //   // if (pluginName in plugins) {
  // //   //   console.error(`conflict: ${pluginName} is already loaded`);
  // //   //   continue;
  // //   // }
  // //   console.log('not loaded yet!', pluginPathName)
  // //   // require('../../../static/plugins/'+pluginName)
  // //
  // //   // pickPluginModule(pluginPath, pluginName);//const PluginModule =
  // //   // console.log(PluginModule)
  // //   // if (PluginModule === null)
  // //   //   continue;
  // //   //
  // //   // const pluginId = path.basename(pluginFile);
  // //   // const pluginConfig = parsePluginConfig(pluginId, pluginFile);
  // //   // if (pluginConfig === null)
  // //   //   continue;
  // //   //
  // //   // try {
  // //   //   const pluginContext = generateContextFunc(pluginId, pluginConfig);
  // //   //   const pluginInstance = PluginModule(pluginContext);
  // //   //   pluginInstance.__pluginContext = pluginContext;
  // //   //   plugins[pluginId] = pluginInstance;
  // //   //   pluginConfigs[pluginId] = pluginConfig;
  // //   //   logger.debug(`${pluginId} loaded`);
  // //   // } catch (e) {
  // //   //   logger.error(`${pluginId} could'nt be created: ${e.stack || e}`);
  // //   // }
  // // }
  // // return { plugins, pluginConfigs };
}


/**
 * Ensure repositories exist (created if necessary).
 */
function ensurePluginRepos() {//: void {
  for (const repo of config.PLUGIN_REPOS) {
    fse.ensureDirSync(repo);
  }
}

module.exports = {
  init: init
  //, loadPlugins: loadPlugins
}

console.log('loaded plugin-manager-plugin!')


// let typescript know this is actually a module, treating variables like
//  'path' as local
// see https://goo.gl/Befc1X
// export {}
