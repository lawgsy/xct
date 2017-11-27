const execa = require("execa");

module.exports = ({common}, s) => {
  return new Promise((resolve, reject) => {
    let whitelist = ['ipconfig', 'systeminfo', 'getmac'];
    const {input} = common.parseInput(s)
    if(whitelist.indexOf(input)!=-1) {
      execa(input).then(result => {
        resolve({
          output: common.txt(`<pre>${result.stdout}</pre>`)
        });
      }).catch(e => reject(e));
    } else {
      resolve({
        output: common.txt(`Please enter a command to execute. ` +
                           `The following commands are whitelisted:<br />` +
                           whitelist.join(', '))
      });
    }
  });
}
