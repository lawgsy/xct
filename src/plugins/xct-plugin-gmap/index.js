module.exports =
  ({vueObj, common}, s) => {
    var {cmd, input} = common.parseInput(s);
    if(input.length>0) {
      var query        = common.webUtils.urlEncode(input);
      vueObj.output =
        common.webUtils.webView(`https://www.google.nl/maps?q=${query}`);
    }
  }
