const fuzzy = require('fuzzy');

module.exports =
  ({vueObj, handlers}, s) => {
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
       .filter(o => o.template.split(' ')[0] != s)
    }
  }
