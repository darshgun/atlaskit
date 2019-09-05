export default () => ({
  outer: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
    '& > *': {
      flexShrink: 0,
    },
  },
});
