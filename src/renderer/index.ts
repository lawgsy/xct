'use strict'

import * as Vue from 'vue'
import * as md from 'markdown'
const markdown = md.markdown
import * as parse from 'yargs-parser'

import common from '../common'

Vue.config.devtools = false
Vue.config.productionTip = false
import * as config from './../config'

import {clipboard} from 'electron'

// var pluginManager = require('../core/xct-plugin-manager/index.js')
import * as pluginManager from './../core/xct-plugin-manager'
import * as xctMath from './../core/xct-plugin-math'
import * as xctAutoComplete from './../core/xct-plugin-autocomplete'


var vueObj = new Vue({
    el: "#app",
    data: {
        versions: {
            electron: process.versions.electron,
            // electronWebpack: require('electron-webpack/package.json').version
        },
        testVar: "test string",
        output: "",
        output_raw: "",
        msg: "",
        msgShowFunc: null,
        suggestions: []
    },
    methods: {
      notify: (text: string) => {
        var x = document.getElementById("snackbar")
        vueObj.msg = text

        if(vueObj.msgShowFunc != null) {
          clearTimeout(vueObj.msgShowFunc);
          vueObj.msgShowFunc = null;
        }

        x.className = "show";
        vueObj.msgShowFunc = setTimeout(function(){
          x.className = x.className.replace("show", "");
          vueObj.msg = "";
          vueObj.msgShowFunc = null;
        }, 3000);
      },
      selectSuggestion: (suggestion, e) => {
        e.preventDefault();
        console.log("stop", e)
        vueObj.suggestions = [];
        // suggestion.template
        var inputElement = <HTMLInputElement>document.getElementById('cmdInput')
        if(inputElement) {
          var firstCmd = suggestion.template.split(' ')[0];
          inputElement.value = suggestion.template.split(' ')[0];
          if (firstCmd != suggestion.template) inputElement.value += " "
          inputElement.focus();
          return false;
        }

      },
      selectSuggestion2: (suggestion, e) => {
        e.preventDefault();
        if(e.keyCode==9) {
          vueObj.suggestions = [];
          // suggestion.template
          var inputElement = <HTMLInputElement>document.getElementById('cmdInput')
          if(inputElement) {
            var firstCmd = suggestion.template.split(' ')[0];
            inputElement.value = suggestion.template.split(' ')[0];
            if (firstCmd != suggestion.template) inputElement.value += " "
            inputElement.focus();
            return false;
          }
        }

      }
    },

    // <input type="text" id="cmdInput" placeholder="..." class="col-11"/>

    template: `
<div>
  <div class="input-group input-inline col-12">
<div class="form-autocomplete col-12">
  <!-- autocomplete input container -->
  <div class="form-autocomplete-input form-input">

    <!-- autocomplete real input box -->
    <input class="form-input col-11" type="text" id="cmdInput" placeholder="" tabindex="1"/>
    <button class="btn btn-primary input-group-btn col-1" id="submitBtn">XCT</button>
  </div>

  <!-- autocomplete suggestion list -->
  <ul class="menu" v-if="suggestions.length">
    <!-- menu list chips -->
    <li class="menu-item" v-for="(index, suggestion) in suggestions">
      <a href="#" v-on:click="selectSuggestion(suggestion, $event)" tabindex="{{index+2}}">
        <div class="tile tile-centered">
          <div class="tile-content">{{suggestion.template}}</div>
        </div>
      </a>
    </li>
  </ul>
</div>
  </div>
  <div v-if="output" id="output" v-html="output"></div>
  <div id="snackbar" v-html="msg"></div>
</div>`
});
// <div class="divider-vert text-dark bg-light" data-content="OUTPUT" v-if="output" style="position:relative"></div>
//
// <button class="btn btn-primary input-group-btn col-2" id="copyBtn">Copy output</button>

(<any>window).vueObj = vueObj; // not a very nice hack to access vueObj.notify through window.vueObj.notify

var unknownCommand =
  (input) => {
    if(input.length>0)
      return `<div class='text'>Command '${input}' not found. Available:<br />${commandList()}</div>`
    else
      return `<div class='text'>Available:<br />${commandList()}</div>`
  }
// import * as figlet from './../plugins/xct-plugin-figlet'
// import * as xkcd from './../plugins/xct-plugin-xkcd'

var isLiveHandler: {
  [index: string] : boolean
}
var handlers: [
  // [index: string] : (context: Object, ...args: string[]) => string
  {
    'pId': string,
    'pattern': string,
    'func': Function,//(context: Object, input: string) => any,
    'live': boolean,
    'usage': string,
    'description': string,
    'template': string
  }
]

handlers = [
  {
    'pId': 'echo',
    'pattern': '^echo .*',
    'func': (_, s: string) => {
      vueObj.output =
        `<div class='text'>${common.parseInput(s).input}</div>`
    },
    'live': true,
    'usage': `**echo** text`,
    'description': 'Echo text back as output',
    'template': 'echo text'
  }
  // 'figlet': (...args: string[]): string => figlet(...args),
  // 'xkcd': (...args: string[]): string => xkcd(context, ...args)
]

var context = {
  vueObj: vueObj,
  common: common,
  markdown: markdown,
  parse: parse,
  handlers: handlers
};

var symbolHandlers: {
  [index: string] : {
    [index: string] : (...args: string[]) => string
  }
}
symbolHandlers = {
  '?': {
    'g':
      (...args: string[]): string => {
        var query = common.webUtils.urlEncode(args.join(' '));
        return common.webUtils.webView(`https://www.google.nl/search?q=${query}`);
      },
    'w':
      (...args: string[]): string => {
        var query = common.webUtils.urlEncode(args.join(' '));
        return common.webUtils.webView(`http://m.wolframalpha.com/input/?i=${query}`);
      }
    //, 'xkcd': (...args: string[]): string => common.webView(`https://m.xkcd.com/`)
  }
}

// TODO: generate/make commands from regexes instead of using handlers
function commandList(): string {
  var cmds: string[] = Object.keys(handlers).map(
    pId => `<div>
${markdown.toHTML(handlers[pId]['usage'])}
→ ${markdown.toHTML(handlers[pId]['description'])}
</div>`
  );
  return cmds.join('');
  // return `${cmds.join('<br />')} <br /><br />Symbols:<br />`+
  //        `${Object.keys(symbolHandlers)
  //          .map(s => s+Object.keys(symbolHandlers[s.toString()]).join(', '+s))
  //        }`
}

function handleCmd(input: string, isSubmit: boolean) {
  if(isSubmit) {
    for(const pId in handlers) {
      if(input.match(handlers[pId].pattern)) {
        handlers[pId].func(context, input);
        return true;
      }
    }
    vueObj.output = unknownCommand(input);
    return false;
  } else {
    if(input=="") vueObj.output = ""
    // xctAutoComplete(context, input);

    for(const pId in handlers) {
      if(handlers[pId].live && input.match(handlers[pId].pattern)) {
        handlers[pId].func(context, input);
        return true;
      }
    }
    // console.log('test')
    vueObj.output = ""
    xctMath(context, input);
    // var output = vueObj.output;

    if(vueObj.output=="") vueObj.output = unknownCommand(input);
    // return false;
  }
}



/*
page logic
 */

document.addEventListener("DOMContentLoaded", function(event) {
  var inputElement = document.getElementById('cmdInput');
  var submitElement = document.getElementById('submitBtn');
  var copyElement = document.getElementById('copyBtn');
  var isSubmit: boolean;

  // bind events
  if(inputElement) {
    inputElement.focus();

    inputElement.onkeypress = (e) => { // onkeyup
      isSubmit = false
      //   xctAutoComplete(context, input);
      if (e==undefined) e = <KeyboardEvent>window.event;
      var keyCode = e.keyCode || e.which;
      if (keyCode == 13) { // enter
        isSubmit = true;
      }

      // prevent submitting when selecting autocomplete by keyboard
      if(inputElement === document.activeElement)
        handleInput(isSubmit);
      // e.preventDefault();

    }

    // update autocomplete after pressing backspace
    inputElement.onkeyup = (e) => { // onkeyup
      isSubmit = false
      if (e==undefined) e = <KeyboardEvent>window.event;
      var keyCode = e.keyCode || e.which;
      if (keyCode == 13) return;
      if (keyCode == 8) { // backspace
        xctAutoComplete(context, (<HTMLInputElement>inputElement).value);
        handleInput(isSubmit);
        return true;
      } else if (keyCode == 13) { // enter
        if(inputElement === document.activeElement) {
          handleInput(isSubmit);
          return true;
        }
      } else {
        handleInput(isSubmit);
        xctAutoComplete(context, (<HTMLInputElement>inputElement).value);
        return true;
      }
    }
  }
  if(submitElement) submitElement.onclick = () => {
    handleInput(true)
  }
  if(copyElement) copyElement.onclick = () => {
    if(vueObj.output != "" && vueObj.output_raw != "") {
      clipboard.writeText(vueObj.output_raw);
      vueObj.notify("Copied output to clipboard.")
    }
  }
  context.vueObj.output = unknownCommand('');
});

function handleInput(isSubmit): void {
  var inputElement = <HTMLInputElement>document.getElementById('cmdInput')
  if(inputElement) handleCmd(inputElement.value, isSubmit);
};

// TODO: perform plugin loading in main process rather than Renderer
// TODO: perform check if a command already belongs to another plugin (overloading is probably a bad idea)
var {loadedPlugins, loadedPluginConfigs} = pluginManager.loadPlugins()

for(const pId in loadedPluginConfigs) {
  var pConfig = loadedPluginConfigs[pId];
  if(pConfig["command"] != null) {
    handlers.push({
      pId: pId,
      pattern: pConfig["command"],
      func: loadedPlugins[pId],
      live: pConfig["live"],
      usage: pConfig["usage"],
      description: pConfig["description"],
      template: pConfig["template"]
    });
    console.log(`loaded '${pId}' with command '${pConfig["command"]}'`)
  }
}
// vueObj.results = handlers
