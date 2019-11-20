import WikiMarkupTransformer from '../../../index';

describe('JIRA wiki markup - Block Card', () => {
  const testCases: Array<[string, string]> = [
    [
      'should create Block Card if on its own line',
      `line 1 
      [http://...|http://...|smart-link]
      line 2 `,
    ],
    [
      'should create Block Card if nothing else in the document',
      `[http://...|http://...|smart-link]`,
    ],
    [
      'should create Block Card if nothing else in the document, file ending with new line',
      `[http://...|http://...|smart-link]
      `,
    ],
    [
      'should create Block Card if nothing else in the document, file starting with new line',
      `
      [http://...|http://...|smart-link]`,
    ],
    [
      'should create Block Card if only whitespace on the same line',
      ` [http://...|http://...|smart-link] `,
    ],
    [
      'should create Block Card if only whitespace on the same line, followed by text',
      ` [http://...|http://...|smart-link] 
      test`,
    ],
    [
      'should create Block Card if only whitespace on the same line, followed by Block Card',
      ` [http://...|http://...|smart-link] 
      [http://...|http://...|smart-link]`,
    ],
    [
      'should create Block Card if nothing else in the table cell',
      `[http://...|http://...|smart-link]
      |Heading 1|Heading 2|
      |[http://...|http://...|smart-link]|[http://...|http://...|smart-link] 
      |`,
    ],
    [
      'should create Inline Card if preceded and followed by text',
      `
      abc [http://...|http://...|smart-link] def
      `,
    ],
    [
      'should create Inline Card if preceded by text',
      `
      abc [http://...|http://...|smart-link]
      `,
    ],
    [
      'should create Inline Card if followed by text',
      `
      [http://...|http://...|smart-link] def
      `,
    ],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
