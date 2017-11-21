// const path = require('path')
// const url = require('url')
// const {clipboard} = require('electron')
const fuzzy = require('fuzzy');
console.log('>>> ',__dirname)

module.exports =
  ({vueObj, common, parse, handlers}, s) => {
    var results = handlers.filter(
      p => p.template.split(' ')[0].indexOf(s) != -1
    )

    vueObj.output = results.map(p => p.template).join('<br />')
    // console.log(__dirname, s, 'hi',results)
  }
