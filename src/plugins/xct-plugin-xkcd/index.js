module.exports =
  ({vueObj, webUtils}, ...args) => {
    vueObj.output = webUtils.webView(`https://m.xkcd.com/`)
  }
