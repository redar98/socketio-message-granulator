const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const webpack = require("webpack");
const webpackConfig = require("../../webpack.dev");
const webpackDevMiddleware = require('webpack-dev-middleware');
const { MSG_TYPES } = require('../shared/constants');
const MessageQueue = require('./messageQueue');

const app = express();
const port = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {});
httpServer.listen(port);
console.log(`[*] Server listening on ${port}`);

app.use(express.static("public"));
if (process.env.NODE_ENV === "development") {
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler));
} else {
    app.use(express.static("dist"));
}

io.on("connection", (socket) => {
    onConnect(socket);

    socket.on("disconnect", onDisconnect);
    socket.on(MSG_TYPES.PING, onPing);
    socket.on(MSG_TYPES.MESSAGE, onMessage);
});

// Simulate Latency on responses
function applyLatency(socket) {
    const emitFn = socket.emit;
    socket.emit = (...args) => setTimeout(() => {
        emitFn.apply(socket, args);
    }, Math.floor(Math.random() * 150));
}

const messageQueue = new MessageQueue();

function onConnect(socket) {
    console.log(`[+] Connection occurred with ${socket.id}`);
    messageQueue.addSocket(socket);
    // applyLatency(socket); This causes delivering messages in an unordered way...
}

function onDisconnect() {
    console.log(`[-] Connection halted with ${this.id}`);
    messageQueue.removeSocket(this);
}

function onPing() {
    this.emit(MSG_TYPES.PONG);
}

function onMessage(msg) {
    console.log(`[ ] ${this.id} queued a message: "${msg}"`);
    messageQueue.queueMessage(msg);
}