import * as fuzzy from "fuzzy";
import {IHandler} from "../../common";

function xctAutoComplete({vueObj, handlers}, s) {
  return new Promise((resolve, reject) => {
    if (s.length < 1) vueObj.suggestions = [];
    else {
      // non-fuzzy version:
      // vueObj.suggestions = handlers.filter(
      //   p => p.template.split(' ')[0].indexOf(s) != -1
      // )

      // fuzzy search:
      // 1. Filter handlers by fuzzy matching against input, s
      //    Only match the first part of the template
      // 2. Map results from fuzzy object matches to strings (.original)
      // 3. Filter handlers by ignoring handler temlates that have the first
      //    part literally match the input string
      vueObj.suggestions = fuzzy.filter(s, handlers, {
        extract: (p: IHandler) => p.template.split(" ")[0],
      }).map( (o) => o.original )
        .filter((o) => o.template.split(" ")[0] !== s);

      // TODO: add suggestion template instead of improvising matches by
      //       matching first part of handler template above
    }
    return resolve({});
  });
}

export default xctAutoComplete;
