"use strict";

import common from "../common";
import * as config from "./../config";

import * as md from "markdown";
import * as Vue from "vue";
import * as parse from "yargs-parser";

const markdown = md.markdown;

Vue.config.devtools      = false;
Vue.config.productionTip = false;

import {clipboard} from "electron";

import * as xctAutoComplete from "./../core/xct-plugin-autocomplete";
import * as xctMath from "./../core/xct-plugin-math";
import * as xctPluginManager from "./../core/xct-pluginmanager";

const vueObj = new Vue({
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
        suggestions: [],
    },
    methods: {
      notify: (text: string) => {
        const snackbar = document.getElementById("snackbar");
        vueObj.msg = text;

        if (vueObj.msgShowFunc != null) {
          clearTimeout(vueObj.msgShowFunc);
          vueObj.msgShowFunc = null;
        }

        snackbar.className = "show";
        vueObj.msgShowFunc = setTimeout(() => {
          snackbar.className = snackbar.className.replace("show", "");
          vueObj.msg = "";
          vueObj.msgShowFunc = null;
        }, 3000);
      },
      selectSuggestion: (suggestion, e) => {
        e.preventDefault();
        vueObj.suggestions = [];

        // suggestion.template
        const inputElement = document.getElementById("cmdInput") as
                              HTMLInputElement;
        if (inputElement) {
          const firstCmd = suggestion.template.split(" ")[0];
          inputElement.value = suggestion.template.split(" ")[0];

          if (firstCmd !== suggestion.template)
            inputElement.value += " ";

          inputElement.focus();
          return false;
        }
      },
    },

    template: `
<div>
  <div class="input-group input-inline col-12">
<div class="form-autocomplete col-12">
  <!-- autocomplete input container -->
  <div class="form-autocomplete-input form-input">

    <!-- autocomplete real input box -->
    <input class="form-input col-11" type="text" id="cmdInput"
           placeholder="" tabindex="1"/>
    <button class="btn btn-primary input-group-btn col-1" id="submitBtn">
      XCT
    </button>
  </div>

  <!-- autocomplete suggestion list -->
  <ul class="menu" v-if="suggestions.length">
    <!-- menu list chips -->
    <li class="menu-item" v-for="(index, suggestion) in suggestions">
      <a href="#" v-on:click="selectSuggestion(suggestion, $event)"
                  tabindex="{{index+2}}">
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
</div>`,
});

/*
not a very nice hack to access
vueObj.notify through window.vueObj.notify
*/
// (<any>window).vueObj = vueObj;

function unknownCommand(input) {
  const output = `Available:<br /> ${commandList()}`;

  return (input.length > 0) ?
    common.txt(`Command '${input}' not found. ` + output) :
    common.txt(output);
}
// import * as figlet from './../plugins/xct-plugin-figlet'
// import * as xkcd from './../plugins/xct-plugin-xkcd'

interface IHandler {
  "pId": string;
  "pattern": string;
  "func": (context: any, input: string) => Promise<{}>;
  "live": boolean;
  "usage": string;
  "description": string;
  "template": string;
}

const handlers: IHandler[] = [ {
    pId: "echo",
    pattern: "^echo .*",
    func: (_, s: string) => {
      return new Promise((resolve, reject) => {
        const {input} = common.parseInput(s);
        if (typeof input !== "undefined") {
          resolve({output: input, bindings: {}});
        } else {
          reject(Error("No parsable input"));
        }
      });
    },
    live: true,
    usage: "**echo** text",
    description: "Echo text back as output",
    template: "echo text",
  },
  // 'figlet': (...args: string[]): string => figlet(...args),
  // 'xkcd': (...args: string[]): string => xkcd(context, ...args)
];

const context = {
  vueObj,
  common,
  markdown,
  parse,
  handlers,
};

function commandList(): string {
  let result: string = "";
  handlers.forEach((h) => {
    result += `<div>${markdown.toHTML(h.usage + " → " + h.description)}</div>`;
  });
  return result;
}

function bindEvent(elementId: string, {evnt, fnct}) {
  const element = document.getElementById(elementId);
  if (element !== null) {
    element.addEventListener(evnt, fnct, false);
  } else {
    console.error(`Element ${elementId} not found to bind event '${evnt}' to.`);
  }
}

function handlePromise(promise: any, pId: string, errFunc: (e) => void) {
  if (Promise.resolve(promise) !== promise) {
    console.error(`'${pId}' did not returning a promise!`);
    return false;
  }
  promise.then(({output, bindings}) => {
    if (!output) {
      console.debug(`'${pId}' resolved promise but did not set output!`);
      return; // do not set output if none exists
    }

    vueObj.output = output;

    // make sure DOM is loaded for binding events
    vueObj.$nextTick(() => {
      for (const elementId in bindings)
        bindEvent(elementId, bindings[elementId]);
    });
  }).catch(errFunc);
  return true;
}

function handleCmd(input: string, isSubmit: boolean) {
  if (input === "") {
    vueObj.output = unknownCommand("");
    return;
  }
  let matched = false;
  for (const index in handlers) {
    if (input.match(handlers[index].pattern)) {
      if (isSubmit || (!isSubmit && handlers[index].live)) {
        const promise = handlers[index].func(context, input);
        handlePromise(promise, handlers[index].pId, (e) => new Error());
      }
      matched = true;
    }
  }
  if (!matched) {// && isSubmit) || input=="") {
    const promise = xctMath(context, input);
    handlePromise(promise, "xct-plugin-math", (e) => {
      // vueObj.output = unknownCommand(""); // unknownCommand(input)
    });
  }
}

/*
page logic
 */

document.addEventListener("DOMContentLoaded", (event) => {
  const inputElement = document.getElementById("cmdInput");
  const submitElement = document.getElementById("submitBtn");
  const copyElement = document.getElementById("copyBtn");
  let isSubmit: boolean;

  // bind events
  if (inputElement) {
    inputElement.focus();

    inputElement.onkeypress = (e) => { // onkeyup
      isSubmit = false;
      //   xctAutoComplete(context, input);
      // if (e === undefined) e = window.event as KeyboardEvent;
      // const keyCode = e.keyCode || e.which;
      // const key = e.key;
      if (e.code === "Enter") { // 13enter
        isSubmit = true;
      }

      // prevent submitting when selecting autocomplete by keyboard
      if (inputElement === document.activeElement)
        handleInput(isSubmit);
      // e.preventDefault();

    };

    // update autocomplete after pressing backspace
    inputElement.onkeyup = (e) => { // onkeyup
      isSubmit = false;
      // if (e === undefined) e = window.event as KeyboardEvent;
      // const keyCode = e.keyCode || e.which;
      if (e.code === "Enter") {
        return;
      } else if (e.code === "Escape") { // escape
        (inputElement as HTMLInputElement).value = "";
        xctAutoComplete(context, "");
        vueObj.output = unknownCommand("");
      } else if (e.code === "Backspace") { // backspace
        xctAutoComplete(context, (inputElement as HTMLInputElement).value);
        handleInput(isSubmit);
        return true;
      } else {
        handleInput(isSubmit);
        xctAutoComplete(context, (inputElement as HTMLInputElement).value);
        return true;
      }
    };
  }
  if (submitElement)
    submitElement.onclick = (e) => { handleInput(true); };
  context.vueObj.output = unknownCommand("");
});

function handleInput(isSubmit): void {
  const inputElement = document.getElementById("cmdInput") as HTMLInputElement;
  if (inputElement) handleCmd(inputElement.value, isSubmit);
}

// TODO: perform plugin loading in main process rather than Renderer
const {loadedPlugins, loadedPluginConfigs} = xctPluginManager.loadPlugins();

for (const pId of Object.keys(loadedPlugins)) {
  const pConfig = loadedPluginConfigs[pId];
  if (pConfig.command !== null) {
    handlers.push({
      pId,
      pattern: pConfig.command,
      func: loadedPlugins[pId],
      live: pConfig.live,
      usage: pConfig.usage,
      description: pConfig.description,
      template: pConfig.template,
    });
    console.log(`loaded '${pId}' with command '${pConfig.command}'`);
  }
}
// vueObj.results = handlers
