var figlet = require('figlet');

module.exports =
  (_, ...args) => `<pre>${figlet.textSync(args.join(' '))}</pre>`
