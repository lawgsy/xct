'use strict'

import * as Vue from 'vue'
// import * as Vue from 'vue'
import {urlencode, webView} from '../common/web-functions'
// import * as common from '../common/web-functions'
//

console.log('Renderer initialized!')

Vue.config.devtools = false
Vue.config.productionTip = false

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


var handlers: {
  [index: string] : (...args: string[]) => string
}
// var context: any = {};
handlers = {
  'echo': (...args: string[]): string => args.join('<br />'),
  // 'figlet': (...args: string[]): string => figlet.Plugin(...args),
  // 'xkcd': (...args: string[]): string => xkcd.Plugin(context, ...args)
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
        var query = urlencode(args.join(' '));
        return webView(`https://www.google.nl/search?q=${query}`);
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

function handleCmd(cmd: string|undefined, args: string[]) {
  if (cmd==undefined) return unknownCommand("", args);
  if(cmd in handlers) return handlers[cmd](...args)
  else if(cmd[0] in symbolHandlers) {
    var symbol = cmd[0];
    cmd = cmd.substr(1);
    if(cmd in symbolHandlers[symbol])
      return symbolHandlers[symbol][cmd](...args)

    return unknownCommand(cmd, args);
  }

  return unknownCommand(cmd, args);
}



/*
page logic
 */

 document.addEventListener("DOMContentLoaded", function(event) {
   var inputElement = document.getElementById('cmdInput');
   var submitElement = document.getElementById('submitBtn');

   // bind events
   if(inputElement) {
     inputElement.focus();

     inputElement.onkeypress = (e) => {
       if (e==undefined) e = <KeyboardEvent>window.event;
       var keyCode = e.keyCode || e.which;
       if (keyCode == 13) handleInput();
     }
   }
   if(submitElement) submitElement.onclick = () => { handleInput() }
 });

 function handleInput(): void {
   var inputElement = <HTMLInputElement>document.getElementById('cmdInput')
   var input: string[] = [];
   if(inputElement) input = inputElement.value.split(' ');

   vueObj.output = handleCmd(input.shift(), input);
 };


 var pluginManager = require('../core/xct-plugin-manager/index.js')
 pluginManager.init()
