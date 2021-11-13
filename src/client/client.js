import "./css/main.css"

const { io } = require("socket.io-client");
const serverUrl = "http://192.168.1.180:3000"; // https or wss server address
const socket = io(serverUrl);

var pingStartTime;

socket.on("connect", () => {
    console.log(`This client is connected with id ${socket.id}`);
    pingStartTime = Date.now();
    socket.emit("ping");
});

socket.on("pong", () => {
    const latency = Date.now() - pingStartTime;
    console.log(`Round-Trip Time: ${latency} ms`);
})