module.exports =
  ({vueObj, common}, s) => {
    var {cmd, input} = common.parseInput(s);
    var query        = common.webUtils.urlEncode(input);
    vueObj.output =
      common.webUtils.webView(`http://m.wolframalpha.com/input/?i=${query}`);
  }
