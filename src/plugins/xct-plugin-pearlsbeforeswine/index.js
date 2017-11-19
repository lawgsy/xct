module.exports =
  ({vueObj, webUtils}, ...args) =>
    vueObj.output = webUtils.webView(`http://www.gocomics.com/pearlsbeforeswine`)
