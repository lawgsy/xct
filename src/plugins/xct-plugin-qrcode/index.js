const QRCode = require('qrcode');

module.exports =
  ({vueObj, common}, s) => {
    QRCode.toDataURL(common.parseInput(s).input, function (err, url) {
      vueObj.output = `<center><img src="${url}"/></center>`
    })
  }
