const convertMarkdownToAnsi = require('../src/convertMdToAnsi');

describe('convertMarkdownToAnsi', () => {
  test('valid md to ANSI', () => {
    const markdown = '**Жовта сова** _на_ `старому дереві` відправилася на подорож\n```\nПід час **своєї_мандрівки**\n```\nвона зустріла _маленького_ їжачка.';
    const expected = '\x1b[1mЖовта сова\x1b[0m \x1b[3mна\x1b[0m \x1b[7mстарому дереві\x1b[0m відправилася на подорож\n\x1b[7m\nПід час **своєї_мандрівки**\n\x1b[0m\nвона зустріла \x1b[3mмаленького\x1b[0m їжачка.';
    expect(convertMarkdownToAnsi(markdown)).toEqual(expected);
  });
  test('invalid md', () => {
    const markdown = '**Жовта сова** _на `старому дереві';
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const processSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    convertMarkdownToAnsi(markdown);
    expect(consoleSpy).toHaveBeenCalledWith('\x1b[31m%s\x1b[0m', 'Error:', 'no closed tag found');
    expect(processSpy).toHaveBeenCalledWith(1);
    consoleSpy.mockRestore();
    processSpy.mockRestore();
  });
});
