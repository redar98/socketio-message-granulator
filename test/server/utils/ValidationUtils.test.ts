import ValidationUtils from '../../../src/server/utils/ValidationUtils';
import SocketProfile from '../../../src/shared/SocketProfile';

describe('SocketProfile Validations', () => {
    let shortNickname = new SocketProfile('XS');
    let aLongNickname = new SocketProfile('over10chars');

    let shortNicknameValid = new SocketProfile('ok3');
    let aLongNicknameValid = new SocketProfile('overlord10');

    it.each([
        [shortNickname, false],
        [aLongNickname, false],
        [shortNicknameValid, true],
        [aLongNicknameValid, true]
    ])('should validate - %p and return %p', (socketProfile, validation) => {
        expect(ValidationUtils.validateSocketProfile(socketProfile)).toBe(validation);
    });
});
