const REGEX = require('./constants');
const findNumberOfMatchesWithRegex = require('./utils');
const checkMarkdownForErrors = require('./checkMdForErrors');

const findNumberOfPreformattedTags = (text) => {
  const openTagsNumber = findNumberOfMatchesWithRegex(text, /^<pre>$/gm);
  const closedTagsNumber = findNumberOfMatchesWithRegex(text, /^<\/pre>$/gm);
  return {
    openTagsNumber,
    closedTagsNumber,
  };
};

const convertParagraphs = (text) => {
  const paragraphs = text.split('\n\n');
  return paragraphs
    .map((paragraph) => {
      const start = (paragraph.startsWith('<pre>') ? '\n' : '');
      const end = (paragraph.endsWith('</pre>') ? '\n' : '');
      const numberOfPreformattedTag = findNumberOfPreformattedTags(paragraph);
      if (numberOfPreformattedTag.openTagsNumber !== numberOfPreformattedTag.closedTagsNumber) {
        if (numberOfPreformattedTag.openTagsNumber > numberOfPreformattedTag.closedTagsNumber) {
          return `<p>${start}${paragraph}${end}\n`;
        }
        return `${start}${paragraph}${end}</p>`;
      }
      if (paragraph !== '') {
        return `<p>${start}${paragraph}${end}</p>`;
      }
      return '\n';
    })
    .join('\n');
};

const convertMarkdownToHTML = (markdown) => {
  checkMarkdownForErrors(markdown);
  const resWithoutParagraphs = markdown
    .replace(REGEX.preformatted, '<pre>$1</pre>')
    .replace(REGEX.bold, '<b>$1</b>')
    .replace(REGEX.italic, '<i>$1</i>')
    .replace(REGEX.monospaced, '<tt>$1</tt>');
  return convertParagraphs(resWithoutParagraphs);
};

module.exports = convertMarkdownToHTML;
