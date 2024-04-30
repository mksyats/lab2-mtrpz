const { convertMarkdownToHTML, findNumberOfPreformattedTags, convertParagraphs } = require('../src/convertMdToHtml');

describe('findNumberOfPreformattedTags', () => {
  test('preformatted tags are invalid (not the only ones on the line)', () => {
    const expectedObject = {
      openTagsNumber: 0,
      closedTagsNumber: 0,
    };
    expect(findNumberOfPreformattedTags('some <pre> text\n123</pre>abc')).toEqual(expectedObject);
  });
  test('simple text in preformatted', () => {
    const expectedObject = {
      openTagsNumber: 1,
      closedTagsNumber: 1,
    };
    expect(findNumberOfPreformattedTags('<pre>\nsome text\n</pre>')).toEqual(expectedObject);
  });
  test('no preformatted tags', () => {
    const expectedObject = {
      openTagsNumber: 0,
      closedTagsNumber: 0,
    };
    expect(findNumberOfPreformattedTags('some text')).toEqual(expectedObject);
  });
  test('only open preformatted tag', () => {
    const expectedObject = {
      openTagsNumber: 1,
      closedTagsNumber: 0,
    };
    expect(findNumberOfPreformattedTags('123\n<pre>\n')).toEqual(expectedObject);
  });
  test('only closed preformatted tag', () => {
    const expectedObject = {
      openTagsNumber: 0,
      closedTagsNumber: 1,
    };
    expect(findNumberOfPreformattedTags('\nsome text\n</pre>')).toEqual(expectedObject);
  });
  test('paragraph with usual preformatted text and the beginning of another', () => {
    const expectedObject = {
      openTagsNumber: 2,
      closedTagsNumber: 1,
    };
    expect(findNumberOfPreformattedTags('<pre>\nsome text\n</pre>\nabc\n<pre>\n123\n')).toEqual(expectedObject);
  });
  test('paragraph that contains the closing tag of the previous paragraph and one plain', () => {
    const expectedObject = {
      openTagsNumber: 1,
      closedTagsNumber: 2,
    };
    expect(findNumberOfPreformattedTags('some text\n</pre>\nabc\n<pre>\n123\n</pre>\n')).toEqual(expectedObject);
  });
});

describe('convertParagraphs', () => {
  test('one line of text', () => {
    expect(convertParagraphs('<b>Жовта сова</b> <i>на</i> <tt>старому дереві</tt> відправилася на подорож.'))
      .toBe('<p><b>Жовта сова</b> <i>на</i> <tt>старому дереві</tt> відправилася на подорож.</p>');
  });
  test('two line of text', () => {
    expect(convertParagraphs('<b>Жовта сова</b> <i>на</i> <tt>старому дереві</tt> відправилася на подорож.\nКінець.'))
      .toBe('<p><b>Жовта сова</b> <i>на</i> <tt>старому дереві</tt> відправилася на подорож.\nКінець.</p>');
  });
  test('two lines of text with a space between them', () => {
    expect(convertParagraphs('<b>Жовта сова</b> <i>на</i> <tt>старому дереві</tt> відправилася на подорож.\n\nКінець.'))
      .toBe('<p><b>Жовта сова</b> <i>на</i> <tt>старому дереві</tt> відправилася на подорож.</p>\n<p>Кінець.</p>');
  });
  test('two lines of text with a space between and after them', () => {
    expect(convertParagraphs('<b>Жовта сова</b> <i>на</i> <tt>старому дереві</tt> відправилася на подорож.\n\nКінець.\n'))
      .toBe('<p><b>Жовта сова</b> <i>на</i> <tt>старому дереві</tt> відправилася на подорож.</p>\n<p>Кінець.\n</p>');
  });
});

describe('markdownToHtml', () => {
  test('valid md to html', () => {
    const markdown = '**Жовта сова** _на_ `старому дереві` відправилася на подорож\n```\nПід час **своєї_мандрівки**\n```\nвона зустріла _маленького_ їжачка.';
    const expected = '<p><b>Жовта сова</b> <i>на</i> <tt>старому дереві</tt> відправилася на подорож\n<pre>\nПід час **своєї_мандрівки**\n</pre>\nвона зустріла <i>маленького</i> їжачка.</p>';
    expect(convertMarkdownToHTML(markdown)).toBe(expected);
  });
  test('invalid md', () => {
    const markdown = '**Жовта сова** _на `старому дереві`';
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const processSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    convertMarkdownToHTML(markdown);
    expect(consoleSpy).toHaveBeenCalledWith('\x1b[31m%s\x1b[0m', 'Error:', 'no closed tag found');
    expect(processSpy).toHaveBeenCalledWith(1);
    consoleSpy.mockRestore();
    processSpy.mockRestore();
  });
});
