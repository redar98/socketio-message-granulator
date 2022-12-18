const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserJSPlugin = require('terser-webpack-plugin');
const CSSMinimizerAssetsPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [new TerserJSPlugin({}), new CSSMinimizerAssetsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        loader: 'webpack-remove-debug'
      }
    ]
  }
});