import SocketProfile from '../../shared/SocketProfile';

export default class ValidationUtils {
    static validateSocketProfile(socketProfile: SocketProfile) {
        try {
            if (!socketProfile || !socketProfile.nickname) {
                return false;
            }

            let nicknameLength = socketProfile.nickname.length;
            if (typeof socketProfile.nickname != 'string' || nicknameLength < 3 || nicknameLength > 10) {
                return false;
            }

            return true;
        } catch (err) {
            return false;
        }
    }
}
