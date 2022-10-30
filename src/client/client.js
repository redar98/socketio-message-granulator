import './css/main.css'

const { io } = require('socket.io-client');
const { MSG_TYPES } = require('../shared/constants');

const serverUrl = 'http://192.168.1.180:3000'; // http(s) or wss server address
const socket = io(serverUrl);

const messageSendButton = document.getElementById('send-button');
const messageInput = document.getElementById('msg-input');
const msgResponseBox = document.getElementById('msg-response-box');

let pingStartTime;

socket.on(MSG_TYPES.CONNECT, onConnect);
socket.on(MSG_TYPES.PONG, onPong);
socket.on(MSG_TYPES.UPDATE, onUpdate);
messageSendButton.onclick = sendMessage;

function onConnect() {
    console.log(`Client has connected with the server using id: ${socket.id}`);
    ping();
}

function onPong() {
    let latency = Date.now() - pingStartTime;
    console.log(`Round-Trip Time: ${latency} ms`);
}

function onUpdate(charCodeArray) {
    charCodeArray = new Uint16Array(charCodeArray);
    let char = String.fromCharCode(charCodeArray[0]);
    msgResponseBox.value += char;
}

function sendMessage() {
    let message = messageInput.value;
    if (message.length > 0) {
        socket.emit(MSG_TYPES.MESSAGE, message);
    }
}

function ping() {
    pingStartTime = Date.now();
    socket.emit(MSG_TYPES.PING)
}