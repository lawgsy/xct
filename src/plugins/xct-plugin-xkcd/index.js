module.exports =
  ({vueObj, common}, ...args) => {
    vueObj.notify('Opening xkcd')
    vueObj.output = common.webUtils.webView(`https://m.xkcd.com/`)
  }
