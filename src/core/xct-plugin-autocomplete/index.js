// const path = require('path')
// const url = require('url')
// const {clipboard} = require('electron')
const fuzzy = require('fuzzy');
console.log('>>> ',__dirname)

module.exports =
  ({vueObj, common, parse, handlers}, s) => {
    if(s.length<1) vueObj.suggestions = [];
    else {
      // vueObj.suggestions = handlers.filter(
      //   p => p.template.split(' ')[0].indexOf(s) != -1
      // )

      // fuzzy search
      vueObj.suggestions = fuzzy.filter(s, handlers,
        { extract: p => p.template.split(' ')[0] }
      ).map( o => o.original )
    }
  }
