module.exports =
  ({vueObj, common}, ...args) => {
    vueObj.notify('Opening pearlsbeforeswine comic...')
    vueObj.output = common.webUtils.webView(`http://www.gocomics.com/pearlsbeforeswine`)
  }
