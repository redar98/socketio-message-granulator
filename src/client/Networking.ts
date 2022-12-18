import io from 'socket.io-client';
import MessageTypes from '../shared/Constants';
import SocketProfile from '../shared/SocketProfile';

const socketProtocol = location.protocol.includes('https') ? 'wss' : 'ws';
const serverUrl = `${socketProtocol}://${location.host}`;
const socket = io(serverUrl, { autoConnect: false });

let connectHandler: () => void;
let disconnectHandler: () => void;
let socketProfile: SocketProfile;
let pingRefreshTimer: NodeJS.Timer | undefined;

socket.on(MessageTypes.CONNECT, sendInitialSocketData);
socket.on(MessageTypes.DISCONNECT, (reason) => onDisconnect(reason));
socket.on(MessageTypes.UPDATE, onUpdate);

export function connect(profile: SocketProfile, connectCallback: () => void, disconnectCallback: () => void) {
    connectHandler = connectCallback;
    disconnectHandler = disconnectCallback;
    socketProfile = profile
    socket.open();
}

export function disconnect() {
    socket.close();
}

function onConnect(errorResponse?: string) {
    if (errorResponse) {
        console.log(`Server rejected: ${errorResponse}`);
        return;
    }
    
    console.log(`Client was synced with the server. ${socket.id}`);
    connectHandler();
}

function onDisconnect(reason: string) {
    // check https://socket.io/docs/v4/server-socket-instance/#disconnect for possible reasons
    console.log(`Disconnected from the server: ${reason}`);
    disconnect();
    stopPingCounter();
    disconnectHandler();
}

function sendInitialSocketData() {
    // server could return some data as well (rank, money, etc.)
    socket.emit(MessageTypes.INITIALIZE, socketProfile, onConnect);
}

function onUpdate(charCodeArray: Uint16Array) {
    let char = String.fromCharCode(charCodeArray[0]);
    console.log(`Received an update: ${char}`);
}

export function startPingCounter(callback: (duration: number) => void) {
    if (!pingRefreshTimer) {
        pingRefreshTimer = setInterval(() => ping(callback), 1_000);
    }
}

export function stopPingCounter() {
    if (pingRefreshTimer) {
        clearInterval(pingRefreshTimer);
        pingRefreshTimer = undefined;
    }
}

function ping(callback: (duration: number) => void) {
    let start = Date.now();

    socket.emit(MessageTypes.PING, () => {
        let duration = Date.now() - start;
        callback(duration);
    });
}
