import { createApp } from './Server';
import webpack, { Compiler, MultiCompiler } from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
const webpackConfig = require('../../webpack.dev.js');

const { app, httpServer } = createApp();
const port = 3000;

const compiler = webpack(webpackConfig) as Compiler | MultiCompiler;
app.use(webpackDevMiddleware(compiler));

httpServer.listen(port, () => {
  console.log(`[DEV] Server listening on port ${port}`);
});
