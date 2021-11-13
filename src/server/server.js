const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const webpack = require("webpack");
const webpackConfig = require("../../webpack.dev");
const webpackDevMiddleware = require('webpack-dev-middleware');

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
    applyLatency(socket);

    socket.on("disconnect", () => {
        console.log(`[-] Connection halted with ${socket.id}`);
    });

    socket.on("ping", () => {
        socket.emit("pong");
    });

    console.log(`[+] Connection occurred with ${socket.id}`);
});

// Simulate Latency on responses
function applyLatency(socket) {
    const emitFn = socket.emit;
    socket.emit = (...args) => setTimeout(() => {
        emitFn.apply(socket, args);
    }, Math.floor(Math.random() * 301));
}