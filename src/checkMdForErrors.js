const findNumberOfMatchesWithRegex = require('./utils');

const checkTextForNestedMarkup = (text) => {
  let error = null;
  const nestedMarkups = [
    /(?:^|\s)(\*\*(?! )(?:(?!\*\* ).)*?_(\S\S?|\S(.+?)\S)_.*(?! )\*\*)(?=\s|$)/g,
    /(?:^|\s)(\*\*(?! )(?:(?!\*\* ).)*?`(\S\S?|\S(.+?)\S)`.*(?! )\*\*)(?=\s|$)/g,
    /(?:^|\s)(_(?! )(?:(?!_ ).)*?`(\S\S?|\S(.+?)\S)`.*(?! )_)(?=\s|$)/g,
    /(?:^|\s)(_(?! )(?:(?!_ ).)*?\*\*(\S\S?|\S(.+?)\S)\*\*.*(?! )_)(?=\s|$)/g,
    /(?:^|\s)(`(?! )(?:(?!` ).)*?_(\S\S?|\S(.+?)\S)_.*(?! )`)(?=\s|$)/g,
    /(?:^|\s)(`(?! )(?:(?!` ).)*?\*\*(\S\S?|\S(.+?)\S)\*\*.*(?! )`)(?=\s|$)/g,
  ];
  if (nestedMarkups.some((nestedMarkupTemplate) => nestedMarkupTemplate.test(text))) {
    error = 'nested markup found';
  }
  return error;
};

const checkTextForNoClosedTags = (text) => {
  let error = null;
  const openedBoldSingleTag = /(?<=^|\s)\*\*(\S.+?\S|\S)/g;
  const closedBoldSingleTag = /(\S.+?\S|\S)\*\*(?=\s|$)/g;
  const openedItalicSingleTag = /(?<=^|\s)_(\S.+?\S|\S)/g;
  const closedItalicSingleTag = /(\S.+?\S|\S)_(?=\s|$)/g;
  const openedMonospacedSingleTag = /(?<=^|\s)`(\S.+?\S|\S)/g;
  const closedMonospacedSingleTag = /(\S.+?\S|\S)`(?=\s|$)/g;
  const preformattedSingleTag = /(?<=^|\n)```(?=\n|$)/g;
  const openedBoldTagsNumber = findNumberOfMatchesWithRegex(text, openedBoldSingleTag);
  const openedItalicTagsNumber = findNumberOfMatchesWithRegex(text, openedItalicSingleTag);
  const openedMonospacedTagsNumber = findNumberOfMatchesWithRegex(text, openedMonospacedSingleTag);
  const closedBoldTagsNumber = findNumberOfMatchesWithRegex(text, closedBoldSingleTag);
  const closedItalicTagsNumber = findNumberOfMatchesWithRegex(text, closedItalicSingleTag);
  const closedMonospacedTagsNumber = findNumberOfMatchesWithRegex(text, closedMonospacedSingleTag);
  if (openedBoldTagsNumber > closedBoldTagsNumber
    || openedItalicTagsNumber > closedItalicTagsNumber
    || openedMonospacedTagsNumber > closedMonospacedTagsNumber) {
    error = 'no closed tag found';
  }
  const matchesPreformattedSingleTag = text.match(preformattedSingleTag);
  if (matchesPreformattedSingleTag !== null) {
    if (matchesPreformattedSingleTag.length % 2 !== 0) error = 'no closed preformatted text';
  }
  return error;
};

const checkMarkdownForErrors = (markdown) => {
  const error = markdown === ''
    ? 'received text is an empty string'
    : checkTextForNestedMarkup(markdown) || checkTextForNoClosedTags(markdown);
  if (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Error:', error);
    process.exit(1);
  }
};

module.exports = checkMarkdownForErrors;
