const fs = require('fs');
const convertMarkdownToHTML = require('./markdown-to-html');
const convertMarkdownToANSI = require('./markdown-to-ansi');

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

fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    process.exit(1);
  }
  try {
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
