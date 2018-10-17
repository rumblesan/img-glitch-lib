/* global __dirname, require, module*/

const path = require('path');

const libraryName = 'glitchlib';

module.exports = (env, argv) => {
  const outputName = `${libraryName}${
    argv && argv.mode === 'production' ? '.min.js' : '.js'
  }`;
  return {
    entry: path.resolve(__dirname, 'src/index.js'),
    mode: 'production',
    devtool: 'eval-source-map',
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: outputName,
      library: libraryName,
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: [['@babel/env']],
          },
        },
      ],
    },
    resolve: {
      modules: [path.resolve('./node_modules'), path.resolve('./src')],
      extensions: ['.json', '.js'],
    },
  };
};
