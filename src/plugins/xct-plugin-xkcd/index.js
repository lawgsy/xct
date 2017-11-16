console.log('loading xkcd-plugin_...')

// exports.Plugin =
//   (context, ...args) => context.common.webView(`https://m.xkcd.com/`)
module.exports =
  (context, ...args) => context.common.webView(`https://m.xkcd.com/`)

console.log('loaded xkcd-plugin_!')
