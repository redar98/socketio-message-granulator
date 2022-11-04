const updatesPerSecond = 30;

// TODO: having TypeScript would bring better typing features
class MessageQueue {
    static #DELIMITER = " ";
    #updateCallback;
    #queue;
    #activeCharIndex;

    constructor(updateCallback) {
        this.#updateCallback = updateCallback;
        this.#queue = [];
        this.#activeCharIndex = 0;
        setInterval(this.update.bind(this), 1_000 / updatesPerSecond);
    }

    queueMessage(message) {
        if (typeof message === "string" && message.length > 0) {
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
        this.#updateCallback(updatePack);
        this.#shiftToNextCharacter();
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
        return this.#queue.length == 0;
    }

    #currentCharacter() {
        return this.#queue[0][this.#activeCharIndex];
    }

    #shiftToNextCharacter() {
        this.#activeCharIndex++;

        if (this.#activeCharIndex >= this.#queue[0].length) {
            this.#queue.shift();
            this.#activeCharIndex = 0;
        }
    }
}

module.exports = MessageQueue;
