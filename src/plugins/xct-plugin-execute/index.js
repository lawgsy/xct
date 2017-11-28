const execa = require("execa");

module.exports = ({common, rawInput}) => {
  return new Promise((resolve, reject) => {
    let whitelist = ['ipconfig', 'systeminfo', 'getmac'];
    const {input} = common.parseInput(rawInput)
    if(whitelist.indexOf(input)!=-1) {
      execa(input).then(result => {
        return resolve({ output: common.txt(`<pre>${result.stdout}</pre>`) });
      }).catch(reject); // (e => reject(e));
    } else {
      return resolve({
        output: common.txt(`Please enter a command to execute. ` +
                           `The following commands are whitelisted:<br />` +
                           whitelist.join(', '))
      });
    }
  });
}
