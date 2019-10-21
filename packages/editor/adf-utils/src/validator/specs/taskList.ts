export default {
  props: {
    content: { type: 'array', items: ['taskItem'], minItems: 1 },
    type: { type: 'enum', values: ['taskList'] },
    attrs: { props: { localId: { type: 'string' } } },
  },
};
