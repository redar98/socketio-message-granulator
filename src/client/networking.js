import io from 'socket.io-client';
import { MSG_TYPES } from '../shared/constants';

const socketProtocol = location.protocol.includes('https') ? 'wss' : 'ws';
const serverUrl = `${socketProtocol}://${location.host}`;
const socket = io(serverUrl, { autoConnect: false });

let connectHandler;
let disconnectHandler;
let socketProfile;
let pingRefreshTimer;

socket.on(MSG_TYPES.CONNECT, sendInitialSocketData);
socket.on(MSG_TYPES.DISCONNECT, (reason) => onDisconnect(reason));
socket.on(MSG_TYPES.UPDATE, onUpdate);

export function connect(profile, connectCallback, disconnectCallback) {
    connectHandler = connectCallback;
    disconnectHandler = disconnectCallback;
    socketProfile = profile
    socket.open();
}

export function disconnect() {
    socket.close();
}

function onConnect(errorResponse) {
    if (errorResponse) {
        console.log(`Server rejected: ${errorResponse}`);
        return;
    }
    
    console.log(`Client was synced with the server. ${socket.id}`);
    connectHandler();
}

function onDisconnect(reason) {
    // check https://socket.io/docs/v4/server-socket-instance/#disconnect for possible reasons
    console.log(`Disconnected from the server: ${reason}`);
    disconnect();
    stopPingCounter();
    disconnectHandler();
}

function sendInitialSocketData() {
    // server could return some data as well (rank, money, etc.)
    socket.emit(MSG_TYPES.INITIALIZE, socketProfile, onConnect);
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
