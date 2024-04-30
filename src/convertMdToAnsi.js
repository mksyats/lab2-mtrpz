const REGEX = require('./constants');
const { checkMarkdownForErrors } = require('./checkMdForErrors');

const convertMarkdownToANSI = (markdown) => {
  checkMarkdownForErrors(markdown);
  return markdown
    .replace(REGEX.preformatted, '\x1b[7m$1\x1b[0m')
    .replace(REGEX.bold, '\x1b[1m$1\x1b[0m')
    .replace(REGEX.italic, '\x1b[3m$1\x1b[0m')
    .replace(REGEX.monospaced, '\x1b[7m$1\x1b[0m');
};

module.exports = convertMarkdownToANSI;
