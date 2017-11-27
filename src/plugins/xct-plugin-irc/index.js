// 1
// var irc = require('irc');
//
// 2
const Client = require('irc-client')
//
// 3
// var ircClient = require('node-irc');
function Greeter() {
  Client.apply(this, arguments);

  this.regexes_private = [];
  this.regexes_public = [];

  this.on("message:public", function(from, to, message) {
    this.regexes_public.filter(function(regex) {
      var matches;
      if (matches = regex[0].exec(message)) {
        regex[1](from, to, message, matches);
      }
    }.bind(this));
  }.bind(this));

  this.on("message:private", function(from, to, message) {
    this.regexes_private.filter(function(regex) {
      var matches;
      if (matches = regex[0].exec(message)) {
        regex[1](from, to, message, matches);
      }
    }.bind(this));
  }.bind(this));

  this.transfers = [];
};
Greeter.prototype = Object.create(Client.prototype, {properties: {constructor: Greeter}});

Greeter.prototype.match_private = function match_private(regex, cb) {
  this.regexes_private.push([regex, cb]);
};

Greeter.prototype.match_public = function match_public(regex, cb) {
  this.regexes_public.push([regex, cb]);
};

Greeter.prototype.match = function match(regex, cb) {
  this.match_private(regex, cb);
  this.match_public(regex, cb);
};

module.exports =
  ({vueObj, common}, s) => {
    vueObj.notify('Connecting to IRC...')
    vueObj.output = ""


    var greeter = new Greeter({
      server: {
        host: "irc.dal.net",
        port: 7000,
      },
      nickname: "xct-lnchr",
      username: "xct-lnchr",
      realname: "xct client",
      channels: [
        "#xct-test",
        // ["#example", "password-for-example"],
      ],
    });
    greeter.on("irc", function(message) {
      vueObj.output += `<div>${message.parameters[1]}</div>`
      console.log(message);
    });
    greeter.match(/^(hey|hi|hello)/i, function(from, to, message, matches) {
      var target = to;

      if (target.toLowerCase() === greeter.nickname.toLowerCase()) {
        target = from;
      }

      greeter.say(target, "no, " + matches[1] + " to YOU, " + from.nick);
    });
    // 3
    // var client = new ircClient('irc.dal.net', 7000, 'xct-lnchr', 'xct-lnchr');
    // client.on('ready', function () {
    //   client.join('#xct-test');
    //   client.say('#xct-test', `I'm jar's proof of concept`);
    // });
    // 2
    // var client = new irc.Client('irc.dal.net:7000', 'xct-lnchr', {
    //     channels: ['#xct-test'],
    // });
    //
    // 1
    // client.addListener('message', function (from, to, message) {
    //   console.log(`${from} => ${to}: ${message}`)
    //   vueObj.output += `<div>${from} => ${to}: ${message}</div>`
    // });
    // client.say('#xct-test', "I'm a bot!");
    //
    //
    return new Promise((resolve, reject) => resolve({}));
  }
