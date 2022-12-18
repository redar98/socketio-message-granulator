import express from 'express';
import { createServer } from 'http'; // https requires key and permission files
import { Server, Socket } from 'socket.io';

import webpack from 'webpack';
const webpackConfig = require('../../webpack.dev.js');
import webpackDevMiddleware from 'webpack-dev-middleware';

import MessageTypes from '../shared/Constants';
import ValidationUtils from './utils/ValidationUtils';
import IdentityManager from './IdentityManager';
import SocketProfile from '../shared/SocketProfile';

const app = express();
const port = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*', // provide legitimate server address
    },
});
const identityManager = new IdentityManager();

initializeServer();

function initializeServer() {
    httpServer.listen(port);
    console.log(`[*] Server is listening on ${port}`);

    app.use(express.static('public'));
    if (process.env.NODE_ENV === 'development') {
        let compiler = webpack(webpackConfig);
        app.use(webpackDevMiddleware(compiler));
    } else {
        app.use(express.static('dist'));
    }

    io.on(MessageTypes.CONNECTION, onConnection);
}

function onConnection(socket: Socket) {
    console.log(`[+] Connection occurred with ${socket.id}`);

    socket.on(MessageTypes.INITIALIZE, (socketProfile, callback) => setSocketProfile(socket, socketProfile, callback));
    socket.on(MessageTypes.DISCONNECT, () => onDisconnect(socket));
    socket.on(MessageTypes.PING, (callback) => callback());
    socket.on(MessageTypes.MESSAGE, (message) => onMessage(socket, message));
}

function setSocketProfile(socket: Socket, socketProfile: SocketProfile, callback: (err?: string) => void) {
    if (!ValidationUtils.validateSocketProfile(socketProfile)) {
        console.log(`[X] Invalid socket profile from ${socket.id}`);
        callback('INVALID');
        terminateSocket(socket);
        return;
    }

    identityManager.addSocketInfo(socket.id, socketProfile);
    callback();

    console.log(`[ ] Client '${socketProfile.nickname}' (${socket.id}) was synced`);
}

function onDisconnect(socket: Socket) {
    identityManager.removeSocketInfo(socket.id);
    console.log(`[-] Connection halted with ${socket.id}`);
}

function onMessage(socket: Socket, message: string) {
    console.log(`${socket.id} queued: '${message}'`);
}

function updateTick(packet: Uint16Array) {
    io.emit(MessageTypes.UPDATE, packet);
}

function terminateSocket(socket: Socket) {
    socket.disconnect();
}

/*
io is server, socket is client. Calling io.emit() broadcasts event on all
sockets, while calling socket.emit() triggers an event on specific client.
Check out Socket.IO cheatsheet: https://socket.io/docs/v3/emit-cheatsheet/
*/
