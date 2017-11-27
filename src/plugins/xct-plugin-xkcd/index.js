module.exports =
  ({vueObj, common}, s) => {
    vueObj.notify('Opening xkcd comic...')
    return new Promise((resolve, reject) => {
      resolve({ output: common.webUtils.webView('https://m.xkcd.com/') })
    })
  }
