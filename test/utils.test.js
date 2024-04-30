const findNumberOfMatchesWithRegex = require('../src/utils');

describe('findNumberOfMatchesWithRegex', () => {
  test('usual regular expression matching', () => {
    const regexForFinding = /\b[A-Z][a-zA-Z]*\b/g;
    expect(findNumberOfMatchesWithRegex('some symbols, Text!\nSymbols... Text again', regexForFinding)).toBe(3);
  });
  test('there are no matches', () => {
    const regexForFinding = /\b[A-Z][a-zA-Z]*\b/g;
    expect(findNumberOfMatchesWithRegex('some symbols, text!\nsymbols... text again', regexForFinding)).toBe(0);
  });
});
