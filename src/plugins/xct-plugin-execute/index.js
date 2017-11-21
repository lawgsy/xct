execa = require("execa")

module.exports =
  ({vueObj, common}, s) => {
    // TODO: maybe add parameter saying whether command was manually executed or by realtime/live output
    whitelist = ['ipconfig', 'systeminfo', 'getmac'];
    var {input} = common.parseInput(s)
    if(whitelist.indexOf(input)!=-1) {
      execa(input).then(result => {
        vueObj.output = `<div class='text'><pre>${result.stdout}</pre></div>`;
      });
    } else {
      vueObj.output = `<div class='text'>Please enter a command to execute. Only the following commands are whitelisted:<br />${whitelist.join(', ')}</div>`
    }
  }
