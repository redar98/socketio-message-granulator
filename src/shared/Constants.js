"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageTypes;
(function (MessageTypes) {
    MessageTypes["CONNECTION"] = "connection";
    MessageTypes["CONNECT"] = "connect";
    MessageTypes["DISCONNECT"] = "disconnect";
    MessageTypes["INITIALIZE"] = "initialize";
    MessageTypes["PING"] = "ping";
    MessageTypes["MESSAGE"] = "message";
    MessageTypes["UPDATE"] = "update";
})(MessageTypes || (MessageTypes = {}));
;
exports.default = MessageTypes;
