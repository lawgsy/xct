module.exports =
  ({vueObj, common}) => {
    vueObj.notify('Opening xkcd comic...');
    return new Promise((resolve, reject) => {
      return resolve({
        output: common.webUtils.webView('https://m.xkcd.com/')
      });
    })
  }
