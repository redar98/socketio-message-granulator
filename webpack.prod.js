const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserJSPlugin = require('terser-webpack-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
        new TerserJSPlugin({
            terserOptions: {
                compress: {
                    drop_console: true,  // removes console.log
                    drop_debugger: true  // removes debugger statements
                }
            }
        }),
        new CSSMinimizerPlugin()
    ],
  }
});
