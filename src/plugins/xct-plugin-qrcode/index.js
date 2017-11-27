const QRCode = require('qrcode');

module.exports =
  ({_, common}, s) => {
    // TODO: maybe add parameter saying whether command was manually executed or by realtime/live output
    return new Promise((resolve, reject) => {
      var {input} = common.parseInput(s)
      if(input) {
        QRCode.toDataURL(input, (err, url) => {
          if(err) reject(Error(err))

          resolve({
            output: `<div class='text'><center><img src="${url}"/></center></div>`
          })
        })
      } else {
        resolve({
          output: `<div class='text'>Please enter text to convert to a QR code.</div>`
        })
      }
    })
  }
