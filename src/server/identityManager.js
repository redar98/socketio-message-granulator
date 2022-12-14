class IdentityManager {

    #sockets;

    constructor() {
        this.#sockets = new Map();
    }

    addSocketInfo(socketId, profile) {
        if (!this.#sockets.has(socketId)) {
            this.#sockets.set(socketId, profile);
        }
    }

    removeSocketInfo(socketId) {
        this.#sockets.delete(socketId);
    }

}

module.exports = IdentityManager;