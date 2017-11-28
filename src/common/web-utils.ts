/**
 * Replicate PHP's urlencode: http://php.net/manual/en/function.urlencode.php
 * @param  {string} s string to be encoded
 * @return {string}   string in which all non-alphanumeric characters except
 *  -_. have been replaced with a percent (%) sign followed by two hex digits
 *  and spaces encoded as plus (+) signs. It is encoded the same way that the
 *  posted data from a WWW form is encoded, that is the same way as in
 *  application/x-www-form-urlencoded media type.
 */
function urlEncode(s: string): string {  // replicate PHP behaviour
  return encodeURIComponent((s + "").toString())
    .replace(/!/g, "%21").replace(/"/g, "%27").replace(/\(/g, "%28")
    .replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/%20/g, "+");
}

/**
 * Wraps input URL in webview
 * @param  {string} url input URL
 * @return {string}     webview-wrapped URL
 */
function webView(url: string): string {
  return `<webview src="${url}"></webview>`;
}

/**
 * Wraps input URL in webview that is aligned to the right
 * @param  {string} url input URL
 * @return {string}     webview-wrapped URL
 */
function webViewRight(url: string): string {
  return `<webview src="${url}" class='webview-right'></webview>`;
}

export {urlEncode, webView, webViewRight};
