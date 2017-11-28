/*
Handle math input (matched against all input, mathjs will evaluate if it is
 proper math input).

Only applied once all other commands have been.
 */
import * as math from "mathjs";
const limitedEval = math.eval;
import {pluginType} from "../../common";

// Security measures
math.import({
  import: () => { throw new Error("Function import is disabled"); },
  createUnit: () => { throw new Error("Function createUnit is disabled"); },
  eval: () => { throw new Error("Function eval is disabled"); },
  parse: () => { throw new Error("Function parse is disabled"); },
  simplify: () => { throw new Error("Function simplify is disabled"); },
  derivative: () => { throw new Error("Function derivative is disabled"); },
}, {override: true});

function xctMath({rawInput}) {
  return new Promise((resolve, reject) => {
    const allowedTypes = ["object", "number"];
    try {
      const result = limitedEval(rawInput.replace(/,/g, "."));
      const resultType = typeof result;
      if (allowedTypes.includes(resultType)) {
        return resolve({
          output: `<div class="text">${rawInput} = ${result}</div>`,
        });
      } else {
        return reject(Error(`Result of type '${typeof result}'`));
      }
    } catch (e) {
      return reject(e);
    }
  });
}

export default xctMath;
