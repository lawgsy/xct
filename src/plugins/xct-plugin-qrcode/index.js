const QRCode = require('qrcode');

module.exports =
  ({_, common, rawInput}) => {
    // TODO: maybe add parameter saying whether command was manually executed or by realtime/live output
    return new Promise((resolve, reject) => {
      var {input} = common.parseInput(rawInput)
      if(input) {
        QRCode.toDataURL(input, (err, url) => {
          if(err) return reject(Error(err));

          return resolve({
            output: `<div class='text'><center><img src="${url}"/></center></div>`
          });
        })
      } else {
        return resolve({
          output: `<div class='text'>Please enter text to convert to a QR code.</div>`
        });
      }
    })
  }
