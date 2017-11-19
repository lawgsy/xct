'use strict'

import * as Vue from 'vue'
// import * as Vue from 'vue'
// import {urlencode, webView} from '../common/web-functions'
import * as webUtils from '../common/web-utils'
//

// console.log('Renderer initialized!')

Vue.config.devtools = false
Vue.config.productionTip = false
import * as config from './../config'

var vueObj = new Vue({
    el: "#app",
    data: {
        versions: {
            electron: process.versions.electron,
            // electronWebpack: require('electron-webpack/package.json').version
        },
        output: ""
    },
    template: `
<div>
  <div class="input-group input-inline col-12">
    <input type="text" id="cmdInput" placeholder="..." class="col-11"/>
    <button class="btn btn-primary input-group-btn col-1" id="submitBtn">XCT</button>
  </div>
  <div class="divider-vert" data-content="OUTPUT" v-if="output" style="position:relative"></div>
  <div v-if="output" id="output" v-html="output"></div>
</div>`
})
// window['vueObj'] = vueObj



var unknownCommand = (cmd: string, args: string[]) => `Command '${cmd} ${args.join(' ')}' not found. Available: ${commandList()}`

// import * as figlet from './../plugins/xct-plugin-figlet'
// import * as xkcd from './../plugins/xct-plugin-xkcd'

var isLiveHandler: {
  [index: string] : boolean
}
var handlers: {
  [index: string] : (context: Object, ...args: string[]) => string
}
isLiveHandler = {}
// var context: any = {};
// context.common = common
handlers = {
  'echo': (...args: string[]): string => args.join('<br />'),
  // 'figlet': (...args: string[]): string => figlet(...args),
  // 'xkcd': (...args: string[]): string => xkcd(context, ...args)
}

var symbolHandlers: {
  [index: string] : {
    [index: string] : (...args: string[]) => string
  }
}
symbolHandlers = {
  '?': {
    'g':
      (...args: string[]): string => {
        var query = webUtils.urlencode(args.join(' '));
        return webUtils.webView(`https://www.google.nl/search?q=${query}`);
      }
    //, 'xkcd': (...args: string[]): string => common.webView(`https://m.xkcd.com/`)
  }
}

function commandList(): string {
  return `${Object.keys(handlers).join(', ')}, `+
         `${Object.keys(symbolHandlers)
           .map(s => s+Object.keys(symbolHandlers[s.toString()]).join(', '+s))
         }`
}
var context = {vueObj, webUtils: webUtils}

function handleCmd(cmd: string|undefined, args: string[], isSubmit: boolean) {
  if(isSubmit) {
    if (cmd==undefined) return unknownCommand("", args);
    if(cmd in handlers) return handlers[cmd](context, ...args)
    else if(cmd[0] in symbolHandlers) {
      var symbol = cmd[0];
      cmd = cmd.substr(1);
      if(cmd in symbolHandlers[symbol])
        return symbolHandlers[symbol][cmd](...args)

      return unknownCommand(cmd, args);
    }

    return unknownCommand(cmd, args);
  } else {
    // console.log("not submit",cmd,args)
    var result = undefined;
    if(cmd in handlers && isLiveHandler[cmd])
      return handlers[cmd](context, ...args)
    // if(result) return result;
  }
}



/*
page logic
 */

document.addEventListener("DOMContentLoaded", function(event) {
  var inputElement = document.getElementById('cmdInput');
  var submitElement = document.getElementById('submitBtn');
  var isSubmit: boolean = false;

  // bind events
  if(inputElement) {
    inputElement.focus();

    // inputElement.onkeypress = (e) => {
    inputElement.onkeyup = (e) => {
      isSubmit = false;
      if (e==undefined) e = <KeyboardEvent>window.event;
      var keyCode = e.keyCode || e.which;
      if (keyCode == 13) {
        isSubmit = true;
        // handleInput(isSubmit);
      }
      handleInput(isSubmit);

    }
  }
  if(submitElement) submitElement.onclick = () => {
    var isSubmit: boolean = true;
    handleInput(isSubmit)
  }
});

function handleInput(isSubmit: boolean): void {
  var inputElement = <HTMLInputElement>document.getElementById('cmdInput')
  var input: string[] = [];
  if(inputElement) input = inputElement.value.split(' ');

  // vueObj.output = handleCmd(input.shift(), input, isSubmit);
  handleCmd(input.shift(), input, isSubmit);
  //
};


var pluginManager = require('../core/xct-plugin-manager/index.js')
var {loadedPlugins, loadedPluginConfigs} = pluginManager.loadPlugins()

for(const pId in loadedPluginConfigs) {
  var pConfig = loadedPluginConfigs[pId];
  if(pConfig["command"] != "") {
    handlers[pConfig["command"]] = loadedPlugins[pId];
    isLiveHandler[pConfig["command"]] = pConfig["live"];
    console.log(`loaded '${pId}' with command '${pConfig["command"]}'`)
  }
}
