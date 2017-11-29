var ps = require('xps');
// const psList = require('ps-list');

//https://www.npmjs.com/package/ps-list

// ps.list().fork(
//   function(error) {
//     throw error
//   },
//   function(processes) {
//     processes.forEach(function(process){
//       console.log(process.name + ': ' + process.pid, process)
//     })
//   }
// );


module.exports = ({vueObj, common, parse, rawInput, markdown, isSubmit}) => {
  const {input} = common.parseInput(rawInput);
  let splitInput = input.split(" ");
  return new Promise((resolve, reject) => {
    if(splitInput[0] == "list") {
      ps.list().fork(
        function(error) {
          return reject(error);
        },
        function(processes) {
          let matches = processes;
          if(splitInput[1] !== undefined) {
            matches = processes.filter(
              (p) => (p.name.indexOf(splitInput[1]) > -1)
            )
          }
          let result = [`No matching processes for '${splitInput[1]}'`];
          if (matches.length>0) {
            result = matches.map( match => `${match.name}: ${match.pid}` );
          }
          return resolve({output: common.txt(result.join('<br />'))});
        }
      );
    } else {
      if(splitInput[0]==="kill" && isSubmit) {
        ps.kill(parseInt(input.split(" ")[1])).fork(
          function(error){
            return resolve({output: `Unable to kill ${splitInput[1]}`});
          },
          function(){
            return resolve({output: `Killed ${splitInput[1]}`});
          }
        );
      } else if(splitInput[0]==="pkill" && isSubmit) {
        ps.list().fork(
          function(error) {
            return reject(error);
          },
          function(processes) {
            let matches = processes;
            if(splitInput[1] !== undefined) {
              matches = processes.filter(
                (p) => (p.name.indexOf(splitInput[1]) > -1)
              )
            }
            let result = [`No matching processes for '${splitInput[1]}'`];
            if (matches.length>0) {
              result = ["<button class='btn btn-primary' id='kill-confirm'>Confirm kill! \n\
              (will attempt to kill ALL of the processes below)</button>"]
              result = result.concat(matches.map( match => `${match.name}: ${match.pid}` ));
              return resolve({
                output: common.txt(result.join('<br />')),
                bindings: {
                  'kill-confirm': {
                    evnt: 'click',
                    fnct: () =>  {
                      vueObj.setInput("");

                      matches.forEach((match) => {
                        ps.kill(match.pid).fork(
                          function(error){
                            vueObj.notify(`Unable to kill ${match.name}: ${match.pid}`);
                          },
                          function(){
                            vueObj.notify(`Killed ${match.name}: ${match.pid}`);
                          }
                        );
                      });
                      vueObj.notify("Finished killing processes.");
                      // TODO: Add functionality to launch child window for continuous output?
                      // TODO: Add stacking snackbar/notification?
                    }
                  }
                }
              });
            } else {
              return resolve({
                output: common.txt(result.join('<br />'))
              });
            }
          }
        );
      } else {
        let table = `
| Commands                   | Description                                |
| -------------------------- | ------------------------------------------ |
| **list**                   | list processes and their pIDs              |
| **kill <pId>**             | kill process by pId                        |
| **pkill <(partial) name>** | kill any process IDs matching partial name |
| **help**                   | show this text                             |`;
        return resolve({
          output: markdown.toHTML(table, "Maruku")
        });
      }
    }
    // ps.kill(parseInt(input)).fork(
    //   function(error){ console.log(`Unable to kill ${input}`) },
    //   function(){ console.log(`Killed ${input}`) }
    // );
  });
}
