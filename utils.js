const findNumberOfMatchesWithRegex = (text, regex) => {
  const matches = text.match(regex);
  return matches !== null ? matches.length : 0;
};

const findNumberOfPreformattedTags = (text) => {
  const openTagsNumber = findNumberOfMatchesWithRegex(text, /<pre>\n/g);
  const closedTagsNumber = findNumberOfMatchesWithRegex(text, /<\/pre>\n/g);
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

const checkTextForNestedMarkup = (text) => {
  const nestedMarkups = [
    /(?:^|\s)(\*\*(?! )(?:(?!\*\* ).)*?_(\S\S?|\S(.+?)\S)_.*(?! )\*\*)(?=\s|$)/g,
    /(?:^|\s)(\*\*(?! )(?:(?!\*\* ).)*?`(\S\S?|\S(.+?)\S)`.*(?! )\*\*)(?=\s|$)/g,
    /(?:^|\s)(_(?! )(?:(?!_ ).)*?`(\S\S?|\S(.+?)\S)`.*(?! )_)(?=\s|$)/g,
    /(?:^|\s)(_(?! )(?:(?!_ ).)*?\*\*(\S\S?|\S(.+?)\S)\*\*.*(?! )_)(?=\s|$)/g,
    /(?:^|\s)(`.(?! )(?:(?!` ).)*?_(\S\S?|\S(.+?)\S)_.*(?! )`)(?=\s|$)/g,
    /(?:^|\s)(`(?! )(?:(?!` ).)*?\*\*(\S\S?|\S(.+?)\S)\*\*.*(?! )`)(?=\s|$)/g,
  ];

  if (nestedMarkups.some((nestedMarkupTemplate) => nestedMarkupTemplate.test(text))) {
    throw new Error('nested markup found');
  }
};

const checkTextForNoClosedTags = (text) => {
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
    throw new Error('no closed tag found');
  }
  const matchesPreformattedSingleTag = text.match(preformattedSingleTag);
  if (matchesPreformattedSingleTag !== null) {
    if (matchesPreformattedSingleTag.length % 2 !== 0) throw new Error('no closed preformatted text');
  }
};

module.exports = {
  convertParagraphs,
  checkTextForNestedMarkup,
  checkTextForNoClosedTags,
};
