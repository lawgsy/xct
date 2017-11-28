module.exports =
  ({vueObj, common}, s) => {
    var {cmd, input} = common.parseInput(s);
    var query        = common.webUtils.urlEncode(input);
    return new Promise((resolve, reject) => {
      if (input.length === 0) return resolve({});

      vueObj.notify('Searching google maps...');
      var loadURL = `https://www.google.nl/maps?q=${query}`;
      return resolve({ output: common.webUtils.webView(loadURL) });
    })
  }
