const REGEX = require('./constants');
const { convertParagraphs, checkTextForNestedMarkup, checkTextForNoClosedTags } = require('./utils');

const convertMarkdownToHTML = (markdown) => {
  const error = checkTextForNestedMarkup(markdown) || checkTextForNoClosedTags(markdown);
  if (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Error:', error);
    process.exit(1);
  }
  const resWithoutParagraphs = markdown
    .replace(REGEX.preformatted, '<pre>$1</pre>')
    .replace(REGEX.bold, '<b>$1</b>')
    .replace(REGEX.italic, '<i>$1</i>')
    .replace(REGEX.monospaced, '<tt>$1</tt>');
  return convertParagraphs(resWithoutParagraphs);
};

module.exports = convertMarkdownToHTML;
