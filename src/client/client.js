import "./css/main.css"

const { io } = require("socket.io-client");
const serverUrl = "http://192.168.1.180:3000"; // https or wss server address
const socket = io(serverUrl);
const { MSG_TYPES } = require('../shared/constants');

const messageSendButton = document.getElementById('send-button');
const messageInput = document.getElementById('msg-input');
const msgResponseBox = document.getElementById('msg-response-box');
var pingStartTime;

socket.on("connect", onConnect);
socket.on(MSG_TYPES.PONG, onPong);
socket.on(MSG_TYPES.UPDATE, onUpdate);
messageSendButton.onclick = sendMessage;

function ping() {
    pingStartTime = Date.now();
    socket.emit(MSG_TYPES.PING)
}

function sendMessage() {
    const msg = messageInput.value;
    if (msg.length > 0) {
        socket.emit(MSG_TYPES.MESSAGE, msg);
    }
}

function onConnect() {
    console.log(`This client is connected with id ${this.id}`);
    ping();
}

function onPong() {
    const latency = Date.now() - pingStartTime;
    console.log(`Round-Trip Time: ${latency} ms`);
}

function onUpdate(charCodeArray) {
    charCodeArray = new Uint16Array(charCodeArray);
    const char = String.fromCharCode(charCodeArray[0]);
    msgResponseBox.value += char;
}