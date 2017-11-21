const url = require('url')
const path = require('path')

module.exports =
  ({vueObj, common}, ...args) => {
    // vueObj.notify('Opening xkcd comic...')
    // vueObj.output = common.webUtils.webView(`https://m.xkcd.com/`)
    menuItems = [

      // { id: "id-test", text: "hello", output: "<webview src='test.html' class='webview-right'></webview>" },
      { id: "id-test", text: "hello", output: "<webview src='"+url.format({
        pathname: path.join(__dirname, 'test.html'),
        protocol: 'file:',
        slashes: true
      })+"' class='webview-right'></webview>" },
      { id: "id-test2", text: "hello2", output: "bloop2"  },
      { id: "id-test3", text: "hello3", output: "bloop3"  },
      { id: "id-test4", text: "hello4", output: "bloop4"  }
    ];
    menuHTML = menuItems.map(item => `
    <li class="menu-item">
      <a href="#" id="${item.id}">
        <i class="icon icon-link"></i> ${item.text}
      </a>
    </li>`).join('');
    vueObj.output = `
    <div class="text">
    <div style="float:left;width:50%;">
    <ul class="menu">
      <!-- menu header text -->
      <li class="divider" data-content="LINKS">
      </li>
      <!-- menu item -->
      ${menuHTML}
    </ul>
    </div>
    <div class="" style="padding-left:10px" id="cntnt">
Content div.
    </div>
    </div>` //<div class="float-left" style="padding-left:10px" id="cntnt">

    // make sure DOM is loaded for binding mouse event
    vueObj.$nextTick(function () {
      menuItems.forEach(item => {
        document.getElementById(item.id).onclick = () =>  {
          // clipboard.writeText(figletOutput.replace(/\r?\n/g, "\r\n"));
          this.notify(`Pressed ${item.text}!`);
          document.getElementById(`cntnt`).innerHTML = item.output;
          return true;
        };
      });
      // document.getElementById(`doClick`).onclick = () =>  {
      //   // clipboard.writeText(figletOutput.replace(/\r?\n/g, "\r\n"));
      //   this.notify(`Pressed!`);
      //   document.getElementById(`cntnt`).innerHTML = "boop!";
      //   return true;
      // };
      // document.getElementById(`doClick2`).onclick = () =>  {
      //   // clipboard.writeText(figletOutput.replace(/\r?\n/g, "\r\n"));
      //   this.notify(`Pressed2!`);
      //   document.getElementById(`cntnt`).innerHTML = "boop2!";
      //   return true;
      // };
    })
  }




// vueObj.output = `
// <div class="text">
// <div style="float:left;width:50%;">
// <ul class="menu">
//   <!-- menu header text -->
//   <li class="divider" data-content="LINKS">
//   </li>
//   <!-- menu item -->
//   <li class="menu-item">
//     <a href="#" id="doClick">
//       <i class="icon icon-link"></i> Slack
//     </a>
//   </li>
//   <!-- menu divider -->
//   <li class="divider"></li>
//   <!-- menu item with badge -->
//   <li class="menu-item">
//     <div class="menu-badge">
//       <label class="label label-primary">2</label>
//     </div>
//     <a href="#" id="doClick2">
//       <i class="icon icon-link"></i> Settings
//     </a>
//   </li>
// </ul>
// </div>
// <div class="float-left" style="padding-left:10px" id="cntnt">
// Content div.
// </div>
// </div>`
