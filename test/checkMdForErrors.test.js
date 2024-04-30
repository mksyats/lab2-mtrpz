const { checkTextForNestedMarkup, checkTextForNoClosedTags, checkMarkdownForErrors } = require('../src/checkMdForErrors');

describe('checkTextForNestedMarkup', () => {
  test('italic in bold', () => {
    expect(checkTextForNestedMarkup('**_some text_** Text without style')).toBe('nested markup found');
  });
  test('bold in monospaced', () => {
    expect(checkTextForNestedMarkup('`**Text**` without style')).toBe('nested markup found');
  });
  test('no nested markup', () => {
    expect(checkTextForNestedMarkup('_some text_ **Text**')).toBe(null);
  });
  test('the markup is written incorrectly, so it is not nested', () => {
    expect(checkTextForNestedMarkup('` _some text_ ` _ **Text** _')).toBe(null);
  });
});

describe('checkTextForNoClosedTags', () => {
  test('all tags closed', () => {
    expect(checkTextForNoClosedTags('**Жовта** сова\nна _старому_ `дереві`\n```\nвідправилася на подорож\n```')).toBe(null);
  });
  test('no closed italic tag', () => {
    expect(checkTextForNoClosedTags('**Жовта** сова\nна _старому `дереві`')).toBe('no closed tag found');
  });
  test('no closed bold tag', () => {
    expect(checkTextForNoClosedTags('**Жовта сова\nна _старому_ `дереві`')).toBe('no closed tag found');
  });
  test('no closed monospaced tag', () => {
    expect(checkTextForNoClosedTags('**Жовта** сова\nна _старому_ `дереві')).toBe('no closed tag found');
  });
  test('no closed preformatted tag', () => {
    expect(checkTextForNoClosedTags('**Жовта** сова\n```\nвідправилася на подорож\nна _старому_ `дереві`')).toBe('no closed preformatted text');
  });
});

describe('checkMarkdownForErrors', () => {
  test.each([
    ['**bold text', 'no closed tag found'],
    ['_italic text', 'no closed tag found'],
    ['`strikethrough text', 'no closed tag found'],
    ['some text\n```\npreformatted', 'no closed preformatted text'],
  ])('no closed tag found (error)', (markdown, errorMessage) => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const processSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    checkMarkdownForErrors(markdown);
    expect(consoleSpy).toHaveBeenCalledWith('\x1b[31m%s\x1b[0m', 'Error:', errorMessage);
    expect(processSpy).toHaveBeenCalledWith(1);
    consoleSpy.mockRestore();
    processSpy.mockRestore();
  });
  test('all tags closed', () => {
    const markdown = '**Жовта сова** _на_ `старому дереві`\n```\nвідправилася на подорож.\n```';
    expect(() => checkMarkdownForErrors(markdown)).not.toThrow();
  });
});
