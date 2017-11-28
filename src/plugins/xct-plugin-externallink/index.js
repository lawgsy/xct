const { shell } = require('electron');

module.exports = ({vueObj}, s) => {
  return new Promise((resolve, reject) => {
    vueObj.notify('Opening google');
    shell.openExternal(`http://www.google.com/`)
    return resolve({});
  });
}
