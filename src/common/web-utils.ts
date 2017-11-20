function urlEncode(str: string) {  // replicate PHP behaviour
  return encodeURIComponent((str + '').toString())
    .replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28')
    .replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

function webView(url: string) {
  return `<webview src="${url}"></webview>`
}

export {urlEncode, webView}
