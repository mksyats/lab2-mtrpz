const REGEX = {
  bold: /(?<=^|\s)\*\*(\S((?:(?!\*\*\s).)*?\S)?)\*\*(?=\s|$)(?![^<pre>]*<\/pre>)/g,
  italic: /(?<=^|\s)_(\S((?:(?!\*\*\s).)*?\S)?)_(?=\s|$)(?![^<pre>]*<\/pre>)/g,
  monospaced: /(?<=^|\s)`(\S((?:(?!\*\*\s).)*?\S)?)`(?=\s|$)(?![^<pre>]*<\/pre>)/g,
  preformatted: /(?<=^|\n)```([\s\S]+?)```(?=\n|$)/g,
};

module.exports = REGEX;
