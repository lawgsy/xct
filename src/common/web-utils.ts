function urlEncode(s: string) {  // replicate PHP behaviour
  return encodeURIComponent((s + "").toString())
    .replace(/!/g, "%21").replace(/"/g, "%27").replace(/\(/g, "%28")
    .replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/%20/g, "+");
}

function webView(url: string) {
  return `<webview src="${url}"></webview>`;
}

function webViewRight(url: string) {
  return `<webview src="${url}" class='webview-right'></webview>`;
}

export {urlEncode, webView, webViewRight};
