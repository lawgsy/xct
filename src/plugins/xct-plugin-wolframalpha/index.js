module.exports =
  ({vueObj, common}, s) => {
    var {cmd, input} = common.parseInput(s);
    if(input.length>0) {
      vueObj.notify('Searching wolfram...')
      var query        = common.webUtils.urlEncode(input);
      vueObj.output =
        common.webUtils.webView(`http://m.wolframalpha.com/input/?i=${query}`);
    }
  }
