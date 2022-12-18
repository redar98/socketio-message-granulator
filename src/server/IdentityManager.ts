import SocketProfile from "../shared/SocketProfile";

export default class IdentityManager {

    #sockets: Map<string, SocketProfile>;

    constructor() {
        this.#sockets = new Map();
    }

    addSocketInfo(socketId: string, profile: SocketProfile) {
        if (!this.#sockets.has(socketId)) {
            this.#sockets.set(socketId, profile);
        }
    }

    removeSocketInfo(socketId: string) {
        this.#sockets.delete(socketId);
    }

}