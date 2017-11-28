module.exports =
  ({vueObj, common}, s) => {
    vueObj.notify('Opening pearlsbeforeswine comic...');
    return new Promise((resolve, reject) => {
      var url = 'http://www.gocomics.com/pearlsbeforeswine';
      return resolve({ output: common.webUtils.webView(url) })
    })
  }
