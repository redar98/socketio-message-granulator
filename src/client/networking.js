import io from 'socket.io-client';
import { MSG_TYPES } from '../shared/constants';

const socketProtocol = location.protocol.includes('https') ? 'wss' : 'ws';
const serverUrl = `${socketProtocol}://${location.host}`;
const socket = io(serverUrl, { autoConnect: false });

let connectHandler;
let disconnectHandler;
let pingRefreshTimer;

socket.on(MSG_TYPES.CONNECT, onConnect);
socket.on(MSG_TYPES.DISCONNECT, onDisconnect);
socket.on(MSG_TYPES.UPDATE, onUpdate);

export function connect(connectCallback, disconnectCallback) {
    connectHandler = connectCallback;
    disconnectHandler = disconnectCallback;
    socket.open();
}

export function disconnect() {
    socket.close();
}

function onConnect() {
    console.log(`Client has connected with the server using id: ${socket.id}`);
    connectHandler();
}

function onDisconnect() {
    console.log('Disconnected from the server.');
    stopPingCounter();
    disconnectHandler();
}

function onUpdate(charCodeArray) {
    charCodeArray = new Uint16Array(charCodeArray);
    let char = String.fromCharCode(charCodeArray[0]);
    console.log(`Received an update: ${char}`);
}

export function startPingCounter(callback) {
    if (!pingRefreshTimer) {
        pingRefreshTimer = setInterval(() => ping(callback), 1_000);
    }
}

export function stopPingCounter() {
    if (pingRefreshTimer) {
        clearInterval(pingRefreshTimer);
        pingRefreshTimer = null;
    }
}

function ping(callback) {
    let start = Date.now();

    socket.emit(MSG_TYPES.PING, () => {
        let duration = Date.now() - start;
        callback(duration);
    });
}
