module.exports =
  ({vueObj, common}, ...args) => {
    vueObj.output = common.webUtils.webView(`https://m.xkcd.com/`)
  }
