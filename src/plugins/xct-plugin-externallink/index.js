const path = require('path')
const url = require('url')
const { shell } = require('electron');
const webUtils = require('../../common/web-utils')

module.exports =
  ({vueObj, _}, ...args) => {
      shell.openExternal(`http://www.google.com/`);
    }
