console.log('loading figlet-plugin...')

var figlet = require('figlet');

module.exports = (...args) => `<pre>${figlet.textSync(args.join(' '))}</pre>`
// exports.Plugin =
//   (...args) => `<pre>${figlet.textSync(args.join(' '))}</pre>`

console.log('loaded figlet-plugin!')
