module.exports =
  ({vueObj, common}, s) => {
    var result = eval(s.replace(/,/g, '.'));
    console.log(result)
    if (Number.isNaN(result))
      vueObj.output = `${s} = NaN`
    else vueObj.output = `${s} = ${result}`
  }
