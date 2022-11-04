const express = require("express");
const { createServer } = require("http"); // https requires key and permission files
const { Server } = require("socket.io");

const webpack = require("webpack");
const webpackConfig = require("../../webpack.dev");
const webpackDevMiddleware = require("webpack-dev-middleware");

const { MSG_TYPES } = require("../shared/constants");
const MessageQueue = require("./messageQueue");

const app = express();
const port = 3000;
const httpServer = createServer(app);
const messageQueue = new MessageQueue();
const io = new Server(httpServer, {
    cors: {
        origin: "*", // provide legitimate server address
    },
});

initializeServer();

function initializeServer() {
    httpServer.listen(port);
    console.log(`[*] Server is listening on ${port}`);

    app.use(express.static("public"));
    if (process.env.NODE_ENV === "development") {
        const compiler = webpack(webpackConfig);
        app.use(webpackDevMiddleware(compiler));
    } else {
        app.use(express.static("dist"));
    }

    io.on(MSG_TYPES.CONNECTION, onConnection);
}

function onConnection(socket) {
    console.log(`[+] Connection occurred with ${socket.id}`);
    messageQueue.addSocket(socket);

    socket.on(MSG_TYPES.DISCONNECT, () => onDisconnect(socket));
    socket.on(MSG_TYPES.PING, (callback) => callback());
    socket.on(MSG_TYPES.MESSAGE, (message) => onMessage(socket, message));
}

function onDisconnect(socket) {
    console.log(`[-] Connection halted with ${socket.id}`);
    messageQueue.removeSocket(socket);
}

function onMessage(socket, message) {
    console.log(`${socket.id} queued: '${message}'`);
    messageQueue.queueMessage(message);
}

/*
io is server, socket is client. Calling io.emit() broadcasts event on all
sockets, while calling socket.emit() triggers an event on specific client.
Check out Socket.IO cheatsheet: https://socket.io/docs/v3/emit-cheatsheet/
*/
