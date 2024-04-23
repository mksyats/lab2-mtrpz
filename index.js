const fs = require('fs');
const { convertParagraphs, checkTextForNestedMarkup, checkTextForNoClosedTags } = require('./utils');
const REGEX = require('./constants');

const filePath = process.argv[2];
const outputFilePathIndex = process.argv.indexOf('--out');
const formatHtmlIndex = process.argv.indexOf('--format=html');
const formatAnsiIndex = process.argv.indexOf('--format=ansi');
const outputFilePath = outputFilePathIndex !== -1 ? process.argv[outputFilePathIndex + 1] : null;
const isFormatHTML = formatHtmlIndex !== -1;
const isFormatANSI = formatAnsiIndex !== -1;

if (!filePath) {
  console.error('Usage: node index.js <path_to_markdown_file> [--out <output_file_path>] [--format=ansi|html]');
  process.exit(1);
}

const convertMarkdownToHTML = (markdown) => {
  const resWithoutParagraphs = markdown
    .replace(REGEX.preformatted, '<pre>$1</pre>')
    .replace(REGEX.bold, '<b>$1</b>')
    .replace(REGEX.italic, '<i>$1</i>')
    .replace(REGEX.monospaced, '<tt>$1</tt>');
  return convertParagraphs(resWithoutParagraphs);
};

const convertMarkdownToANSI = (markdown) => markdown
  .replace(REGEX.preformatted, '\x1b[7m$1\x1b[0m')
  .replace(REGEX.bold, '\x1b[1m$1\x1b[0m')
  .replace(REGEX.italic, '\x1b[3m$1\x1b[0m')
  .replace(REGEX.monospaced, '\x1b[7m$1\x1b[0m');

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    process.exit(1);
  }
  try {
    checkTextForNestedMarkup(data);
    checkTextForNoClosedTags(data);
    let res = convertMarkdownToHTML(data);
    if (outputFilePath) {
      if (isFormatHTML) {
        res = convertMarkdownToHTML(data);
      } else if (isFormatANSI) {
        res = convertMarkdownToANSI(data);
      }
      fs.writeFile(outputFilePath, res, (writeErr) => {
        if (err) {
          console.error('Error writing to file:', writeErr);
          process.exit(1);
        }
        console.log(`Content has been written to ${outputFilePath}`);
      });
    } else if (isFormatHTML) {
      res = convertMarkdownToHTML(data);
    } else {
      res = convertMarkdownToANSI(data);
    }
    console.log(res);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
});
