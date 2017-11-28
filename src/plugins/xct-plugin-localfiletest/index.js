const path = require('path')
const url = require('url')

module.exports =
  ({vueObj, common}) => {
    vueObj.notify('Opening local file...');

    return new Promise((resolve, reject) => {
      var loadURL = url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
      })
      return resolve({output: common.webUtils.webView(loadURL)})
    })
  }
