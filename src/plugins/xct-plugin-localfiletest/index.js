const path = require('path')
const url = require('url')

module.exports =
  ({vueObj, common}, ...args) => {
    vueObj.notify('Opening local file...')

    vueObj.output = common.webUtils.webView(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }
