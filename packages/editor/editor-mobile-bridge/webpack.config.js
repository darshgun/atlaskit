/* eslint import/no-extraneous-dependencies: 0, flowtype/require-valid-file-annotation: 0 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const moduleResolveMapBuilder = require('@atlaskit/multi-entry-tools/module-resolve-map-builder');

module.exports = async function createWebpackConfig(_, args) {
  const mode = typeof args.mode === 'undefined' ? 'development' : args.mode;
  const devtool =
    mode === 'development' && typeof args.devtool !== 'string'
      ? 'source-map'
      : args.devtool;

  return {
    mode,
    entry: {
      editor: './src/editor/index.tsx',
      renderer: './src/renderer/index.tsx',
      'error-reporter': './src/error-reporter.ts',
    },
    stats: {
      warnings: false,
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist/bundle'),
    },
    devtool,
    resolve: {
      mainFields: ['atlaskit:src', 'module', 'browser', 'main'],
      extensions: ['.js', '.json', '.ts', '.tsx'],
      alias: {
        ...(await moduleResolveMapBuilder()),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: true,
            babelrc: true,
            rootMode: 'upward',
            envName: 'production:esm',
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public/editor.html.ejs'),
        chunks: ['error-reporter', 'editor'],
        chunksSortMode: 'manual',
        filename: 'editor.html',
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public/renderer.html.ejs'),
        chunks: ['error-reporter', 'renderer'],
        chunksSortMode: 'manual',
        filename: 'renderer.html',
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
    optimization: {
      nodeEnv: JSON.stringify(mode),
      splitChunks: false,
    },
  };
};
