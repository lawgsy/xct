const url = require('url')
const path = require('path')

module.exports =
  ({vueObj, common}, ...args) => {
    let webview = common.webUtils.webViewRight;
    menuItems = [
      { id: "id-test", text: "hello",
        output: webview(url.format({
          pathname: path.join(__dirname, 'test.html'),
          protocol: 'file:',
          slashes: true
        }))
      },
      { id: "id-test2", text: "hello2", output: common.txt("bloop2")  },
      { id: "id-google", text: "Google",
        output: webview("http://www.google.com/")
      },
      { id: "id-xkcd", text: "XKCD",
        output: webview("http://m.xkcd.com/")
      },
    ];
    let menuHTML = "";
    let bindings = {};
    menuItems.forEach(item => {
      menuHTML += `<li class="menu-item">` +
                  `<a href="#" id="${item.id}">${item.text}</a>` +
                  `</li>`;
      bindings[item.id] = {
        evnt: 'click',
        fnct: () =>  {
          vueObj.notify(`Pressed ${item.text}!`);
          document.getElementById(`cntnt`).innerHTML = item.output;
        }
      };
    });

    return new Promise((resolve, reject) => {
      return resolve({
        output: `
<div class="text">
  <div style="float:left;width:50%;">
    <ul class="menu">
      <!-- menu header text -->
      <li class="divider" data-content="LINKS"></li>
      <!-- menu item -->
      ${menuHTML}
    </ul>
  </div>
  <div class="" style="padding-left:10px" id="cntnt">
    ${common.txt("Content div.")}
  </div>
</div>`,
        bindings
      })
    });
  }
