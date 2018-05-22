import WikiMarkupTransformer from '../../src';

describe('JIRA wiki markup - headings', () => {
  const testCases: Array<[string, string]> = [
    [
      'should convert string with heading in it',
      `
This is a string.
h1. Boom! this is a heading with *bold* text in it
      `,
    ],
    ['should allow heading inside panel', '{panel}h1. heading{panel}'],
    ['should treat h7 as usual text inside macro', '{panel}h7. heading{panel}'],
  ];

  for (const [testCaseDescription, markup] of testCases) {
    it(testCaseDescription, () => {
      const transformer = new WikiMarkupTransformer();
      expect(transformer.parse(markup)).toMatchSnapshot();
    });
  }
});
