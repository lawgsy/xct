const { shell } = require('electron');

module.exports =
  ({vueObj}, ...args) => {
      shell.openExternal(`http://www.google.com/`);
    }
