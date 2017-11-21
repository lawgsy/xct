module.exports =
  ({vueObj, common}, ...args) => {
    vueObj.notify('Opening xkcd comic...')
    vueObj.output = common.webUtils.webView(`https://m.xkcd.com/`)
  }
