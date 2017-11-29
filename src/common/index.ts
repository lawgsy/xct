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
 * @return {string}       input string wrapped text div for output
 */
function txt(input: string) {
  return `<div class='txt'>${input}</div>`;
}
function txtRight(input: string) {
 return `<div class='txt-right'>${input}</div>`;
}

type pluginType = (context: IContext) => Promise<{}>;

interface IHandler {
  "pId": string;
  "pattern": string;
  "func": pluginType;
  "live": boolean;
  "usage": string;
  "description": string;
  "template": string;
}
interface IContext {
  vueObj: any;
  common: any;
  markdown: any;
  parse: any;
  handlers: IHandler[];
  rawInput: string;
  isSubmit: boolean|undefined;
}

export { parseInput, txt, txtRight, webUtils, IContext, IHandler, pluginType };
export default { parseInput, txt, txtRight, webUtils };
