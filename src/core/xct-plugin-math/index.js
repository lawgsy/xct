var math = require('mathjs')

module.exports =
  ({vueObj, common}, s) => {
    // var result = eval(s.replace(/,/g, '.'));
    // "command": "^[-+/*\\d\\s,\\.\\( )]+$",
    try {
      var result = math.eval(s.replace(/,/g, '.'));
      if(typeof result === "number" || typeof result === "object")
        vueObj.output = `${s} = ${result}`
      //else vueObj.output = (typeof result)
    } catch(e) {
      return false;
    }
    // console.log(result)
    // if (isNaN(result))
    //   vueObj.output = `${s} = NaN`
  }
