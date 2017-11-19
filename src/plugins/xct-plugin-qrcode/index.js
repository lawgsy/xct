const QRCode = require('qrcode');

module.exports =
  ({vueObj, webUtils}, ...args) => {
    var inputStr = args.join(' ');
    if(inputStr.trim().length > 0) {
      QRCode.toDataURL(args.join(' '), function (err, url) {
        vueObj.output = `<center><img src="${url}"/></center>`
      })
    } else {
      vueObj.output = `<center>No input to convert to QR code.</center>`
    }
  }
