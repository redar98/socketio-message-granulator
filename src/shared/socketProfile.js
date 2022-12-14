class SocketProfile {

    constructor(nickname) {
        this.nickname = nickname;
    }

    static validate(socketProfile) {

        if (!socketProfile || !socketProfile.nickname) {
            return false;
        }

        if (socketProfile.nickname.length > 10) {
            return false;
        }

        return true;
    }
}

module.exports = SocketProfile;