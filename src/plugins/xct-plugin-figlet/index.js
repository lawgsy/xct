var figlet = require('figlet');
const path = require('path')
const url = require('url')
const {clipboard} = require('electron')

module.exports =
  ({vueObj, common, parse, rawInput}) => {
    return new Promise((resolve, reject) => {
      // vueObj.notify('Executing figlet...')
      var text = common.parseInput(rawInput).input;

      // split into arguments, taking quotation marks into account
      var positionalArgs = parse(text)._;

      if(positionalArgs[0] == "help") {
        return resolve({
          output: `<div class='text'>Type 'figlet examples' for examples of fonts listed here. Available fonts: <br />${figlet.fontsSync()}</div>`
        });
      } else if(positionalArgs[0] == "examples") {
        var loadURL = url.format({
          pathname: path.join(__dirname, 'examples.html'),
          protocol: 'file:',
          slashes: true
        });

        return resolve({ output: common.webUtils.webView(loadURL) });
      } else {
        if(text.length==0) {
          return resolve({
            output: `<div class='text'>Please enter some text to convert to ASCII.</div>`
          });
        }
        var font = positionalArgs.shift();
        if (figlet.fontsSync().indexOf(font) != -1) {
          // strip font from text (and quotation marks if present)
          if(text[0]=="\"") text = text.substring(font.length+3, text.length);
          else text = text.substring(font.length+1, text.length);

          return resolve({
            output: `<pre>${figlet.textSync(text, font)}</pre>`
          });
        } else {
          var figletOutput = figlet.textSync(text);
          return resolve({
            output: `
<pre>${figletOutput}</pre>
<button id='copyText' class='btn btn-primary centered'>
  Copy to clipboard
</button>`,
            bindings: {
              'copyText': {
                evnt: 'click',
                fnct: () =>  {
                  clipboard.writeText(figletOutput.replace(/\r?\n/g, "\r\n"));
                  vueObj.notify(`Copied '${text}' as ascii to clipboard.`);
                }
              }
            }
          });
        }
      }
    });

  }
