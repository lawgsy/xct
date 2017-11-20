var figlet = require('figlet');
const path = require('path')
const url = require('url')
const {clipboard} = require('electron')

module.exports =
  ({vueObj, common, parse}, s) => {
    var text = common.parseInput(s).input;
    var positionalArgs = parse(text)._ // split into arguments, taking quotation marks into account

    if(positionalArgs[0] == "help") {
      vueObj.output = `Type 'figlet examples' for examples of fonts listed here. Available fonts: <br />${figlet.fontsSync()}`
    } else if(positionalArgs[0] == "examples") {
      vueObj.output = common.webUtils.webView(url.format({
        pathname: path.join(__dirname, 'examples.html'),
        protocol: 'file:',
        slashes: true
      }))
      // figlet.fonts(function(err, fonts) {
      //   if (err) {
      //       console.dir(err);
      //       return;
      //   }
      //   vueObj.output = "";
      //   fonts.map(font => {
      //     // return `font: ${font}<br/><pre>${figlet.textSync(font, font)}</pre>`
      //     figlet("Test", font, function(err, text) {
      //       if (err) {
      //         console.log('something went wrong...');
      //         console.dir(err);
      //         return;
      //       }
      //       vueObj.output += `font: ${font}<br /><pre>${text}</pre><br /><br />`
      //     });
      //   })
      // });
    } else {
      var font = positionalArgs.shift();
      if (figlet.fontsSync().indexOf(font) != -1) {
        // strip font from text (and quotation marks if present)
        if(text[0]==`"`) text = text.substring(font.length+3, text.length);
        else text = text.substring(font.length+1, text.length);

        vueObj.output = `<pre>${figlet.textSync(text, font)}</pre>`
      } else {
        var figletOutput = figlet.textSync(text);
        vueObj.output = `<pre>${figletOutput}</pre><button id='copyText'>Copy to clipboard</button>`

        // make sure DOM is loaded for binding mouse event
        vueObj.$nextTick(function () {
          document.getElementById(`copyText`).onclick = () =>  {
            clipboard.writeText(figletOutput.replace(/\r?\n/g, "\r\n"));
            this.notify(`Copied '${text}' as ascii to clipboard.`);
            return true;
          };
        })
      }
    }
  }
