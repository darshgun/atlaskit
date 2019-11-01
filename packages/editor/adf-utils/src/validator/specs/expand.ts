export default {
  props: {
    type: { type: 'enum', values: ['expand'] },
    attrs: { props: { title: { type: 'string', optional: true } } },
    content: 'extension_content',
    marks: { type: 'array', items: ['breakout'], optional: true },
  },
  required: ['content'],
};
