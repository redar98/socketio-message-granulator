import "./css/main.css";

const { io } = require("socket.io-client");
const { MSG_TYPES } = require("../shared/constants");

const serverUrl = "localhost:3000"; // http(s) or ws(s) server address
const socket = io(serverUrl);

const pingField = document.querySelector("#ping-counter>span");
const messageSendButton = document.getElementById("send-button");
const messageInput = document.getElementById("msg-input");
const msgResponseBox = document.getElementById("msg-response-box");

let pingRefreshTimer;

initializeClient();

function initializeClient() {
    socket.on(MSG_TYPES.CONNECT, onConnect);
    socket.on(MSG_TYPES.UPDATE, onUpdate);
    socket.on(MSG_TYPES.DISCONNECT, onDisconnect);
    messageSendButton.onclick = sendMessage;
}

function onConnect() {
    console.log(`Client has connected with the server using id: ${socket.id}`);
    pingRefreshTimer = setInterval(ping, 1_000);
}

function onDisconnect() {
    console.log("Disconnected from the server.");
    clearInterval(pingRefreshTimer);
    setPingText("DISC");
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
    let start = Date.now();

    socket.emit(MSG_TYPES.PING, () => {
        let duration = Date.now() - start;
        setPingText(`${duration}ms`);
    });
}

function setPingText(text) {
    pingField.textContent = text;
}
