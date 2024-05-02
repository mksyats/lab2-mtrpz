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
  const symbolsForTags = ['\\*\\*', '_', '`'];
  symbolsForTags.some((symbolForCurrentTag) => {
    const currentTagOpenedPart = new RegExp(`(?<=^|\\s)${symbolForCurrentTag}(\\S.+?\\S|\\S)`, 'g');
    const currentTagClosedPart = new RegExp(`(\\S.+?\\S|\\S)${symbolForCurrentTag}(?=\\s|$)`, 'g');
    const currentTagsOpenedPartNumber = findNumberOfMatchesWithRegex(text, currentTagOpenedPart);
    const currentTagsClosedPartNumber = findNumberOfMatchesWithRegex(text, currentTagClosedPart);
    if (currentTagsOpenedPartNumber > currentTagsClosedPartNumber) {
      error = 'no closed tag found';
      return true;
    }
    return false;
  });
  const preformattedSingleTag = /(?<=^|\n)```(?=\n|$)/g;
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

module.exports = {
  checkMarkdownForErrors,
  checkTextForNestedMarkup,
  checkTextForNoClosedTags,
};
