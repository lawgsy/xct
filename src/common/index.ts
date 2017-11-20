import * as webUtils from './web-utils'


/**
 * Return input string without first word/command
 * @param  {string} input input string
 * @return {string}       input string without first word/command
 */
function parseInput(input: string): {cmd: string, input: string} {
  var inputWords = input.split(' ');
  return { cmd: inputWords.shift(), input: inputWords.join(' ') };
}

export { parseInput, webUtils }
export default { parseInput, webUtils }
