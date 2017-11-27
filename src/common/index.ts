import * as webUtils from "./web-utils";

/**
 * Return input string without first word/command
 * @param  {string} input input string
 * @return {string}       input string without first word/command
 */
function parseInput(input: string): {cmd: string, input: string} {
  const inputWords = input.split(" ");
  return { cmd: inputWords.shift(), input: inputWords.join(" ") };
}

/**
 * Wrap input string in div ready for output
 * @param  {string} input input string
 * @return {[type]}       input string wrapped text div for output
 */
function txt(input: string) {
  return `<div class='text'>${input}</div>`;
}
// function txtRight(input: string) {
//  return `<div class='text-right'>${input}</div>`;
// }

export { parseInput, txt, webUtils };
export default { parseInput, txt, webUtils };
