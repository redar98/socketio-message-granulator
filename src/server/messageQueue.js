const { MSG_TYPES } = require('../shared/constants');
const updatesPerSecond = 30;

class MessageQueue {
    static #DELIMITER = ' ';
    #sockets;
    #queue;
    #activeCharIndex;

    constructor() {
        this.#sockets = [];
        this.#queue = [];
        this.#activeCharIndex = 0;
        setInterval(this.update.bind(this), 1_000 / updatesPerSecond);
    }

    addSocket(socket) {
        this.#sockets.push(socket);
    }

    removeSocket(socket) {
        this.#sockets.splice(this.#sockets.indexOf(socket), 1);
    }

    queueMessage(message) {
        if (typeof message === 'string' && message.length > 0) {
            if (this.#queue.length > 0) {
                message = MessageQueue.#DELIMITER + message;
            }

            this.#queue.push(message);
        }
    }

    update() {
        if (this.#nothingToSend()) {
            return;
        }

        let updatePack = this.#packUpdate();
        this.#sockets.forEach(socket => {
            socket.emit(MSG_TYPES.UPDATE, updatePack);
        });

        this.#shiftNextCharacter();
    }

    #packUpdate() {
        // we could just send the char code without packing it in an array,
        // but once there will be more data, it will all be packed in this
        // array to transmit the data as efficiently as possible.
        // Using Uint16 instead of Uint8 to cover extended char codes.
        let charCode = this.#currentCharacter().charCodeAt();
        return Uint16Array.of(charCode);
    }

    #nothingToSend() {
        return this.#queue.length == 0 || this.#sockets.length == 0;
    }

    #currentCharacter() {
        return this.#queue[0][this.#activeCharIndex];
    }

    #shiftNextCharacter() {
        this.#activeCharIndex++;

        if (this.#activeCharIndex >= this.#queue[0].length) {
            this.#queue.shift();
            this.#activeCharIndex = 0;
        }
    }
}

module.exports = MessageQueue;