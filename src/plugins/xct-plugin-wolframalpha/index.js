module.exports =
  ({vueObj, common}, s) => {
    var {cmd, input} = common.parseInput(s);
    var query        = common.webUtils.urlEncode(input);
    return new Promise((resolve, reject) => {
      if (input.length === 0) return resolve({});

      vueObj.notify('Searching wolfram...');
      var loadURL = `http://m.wolframalpha.com/input/?i=${query}`
      return resolve({ output: common.webUtils.webView(loadURL) })
    });
  }
