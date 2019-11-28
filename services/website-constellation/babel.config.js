//@flow

module.exports = {
  plugins: [
    ['@babel/plugin-proposal-class-properties', {}, 'atlaskit'],
    ['@babel/plugin-proposal-object-rest-spread', {}, 'atlaskit'],
    ['@babel/syntax-dynamic-import', {}, 'atlaskit'],
  ],
  presets: ['@babel/react', '@babel/flow'],
};
