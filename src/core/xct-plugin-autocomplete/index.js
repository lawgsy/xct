// const path = require('path')
// const url = require('url')
// const {clipboard} = require('electron')
const fuzzy = require('fuzzy');

module.exports =
  ({vueObj, common, parse, handlers}, s) => {
    if(s.length<1) vueObj.suggestions = [];
    else {
      // non-fuzzy version:
      // vueObj.suggestions = handlers.filter(
      //   p => p.template.split(' ')[0].indexOf(s) != -1
      // )

      // fuzzy search
      vueObj.suggestions = fuzzy.filter(s, handlers,
        // match first portion of plugin command template, only
        { extract: p => p.template.split(' ')[0] }
      ).map( o => o.original )
    }
  }
