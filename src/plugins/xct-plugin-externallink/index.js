const { shell } = require('electron');

module.exports =
  ({vueObj}, ...args) => {
      vueObj.notify('Opening google')
      shell.openExternal(`http://www.google.com/`);
    }
