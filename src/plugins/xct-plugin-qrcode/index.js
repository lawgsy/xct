const QRCode = require('qrcode');

module.exports =
  ({vueObj, common}, s) => {
    var {input} = common.parseInput(s)
    if(input) {
      QRCode.toDataURL(input, function (err, url) {
        vueObj.output = `<center><img src="${url}"/></center>`
      })
    } else {
      vueObj.output = `Please enter text to convert to a QR code.`
    }
  }
