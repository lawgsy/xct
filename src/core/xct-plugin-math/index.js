var math = require('mathjs');
var limitedEval = math.eval;

math.import({
  'import':     function () { throw new Error('Function import is disabled') },
  'createUnit': function () { throw new Error('Function createUnit is disabled') },
  'eval':       function () { throw new Error('Function eval is disabled') },
  'parse':      function () { throw new Error('Function parse is disabled') },
  'simplify':   function () { throw new Error('Function simplify is disabled') },
  'derivative': function () { throw new Error('Function derivative is disabled') }
}, {override: true});

module.exports = (_, s) => {
    return new Promise((resolve, reject) => {
      try {
        var result = limitedEval(s.replace(/,/g, '.'));
        if(typeof result === "number" || typeof result === "object") {
          resolve({
            output:   `<div class="text">${s} = ${result}</div>`,
            bindings: {}
          });
        } else {
          reject(Error(`Result of type '${typeof result}'`));
        }
      } catch(e) {
        reject(e);
      }
    });
  }
