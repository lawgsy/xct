module.exports =
  ({vueObj, common}, ...args) =>
    vueObj.output = common.webUtils.webView(`http://www.gocomics.com/pearlsbeforeswine`)
