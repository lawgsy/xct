var figlet = require('figlet');

module.exports =
  ({vueObj}, ...args) =>
    { vueObj.output = `<pre>${figlet.textSync(args.join(' '))}</pre>` }
