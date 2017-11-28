module.exports =
  ({vueObj, common}, s) => {
    vueObj.notify('Opening xkcd comic...');
    return new Promise((resolve, reject) => {
      return resolve({
        output: common.webUtils.webView('https://m.xkcd.com/')
      });
    })
  }
