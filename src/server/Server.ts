import express from 'express';
import { createServer } from 'http'; // https requires key and permission files
import { Server, Socket } from 'socket.io';

import MessageTypes from '../shared/Constants';
import ValidationUtils from './utils/ValidationUtils';
import IdentityManager from './IdentityManager';
import SocketProfile from '../shared/SocketProfile';
import path from 'path';

export function createApp() {
    const app = express()
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: '*', // provide legitimate server address
        },
    });
    const identityManager = new IdentityManager();

    const publicPath = path.join(process.cwd(), 'public/assets');
    app.use('/assets', express.static(publicPath));

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

    // Register connection listener
    io.on(MessageTypes.CONNECTION, onConnection);

    return { app, httpServer, io, identityManager, updateTick };
}

/*
io is server, socket is client. Calling io.emit() broadcasts event on all
sockets, while calling socket.emit() triggers an event on specific client.
Check out Socket.IO cheatsheet: https://socket.io/docs/v3/emit-cheatsheet/
*/
