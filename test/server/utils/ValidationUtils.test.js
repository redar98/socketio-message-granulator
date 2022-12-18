const ValidationUtils = require('../../../src/server/utils/ValidationUtils');

describe('SocketProfile Validations', () => {
    let undefinedProf = undefined;
    let missingFields = { };
    let corruptObject = { nickname: { corrupted: true } };
    let shortNickname = { nickname: 'XS' };
    let aLongNickname = { nickname: 'over10chars' };

    let shortNicknameValid = { nickname: 'ok3' };
    let aLongNicknameValid = { nickname: 'overlord10' };

    it.each([
        [undefinedProf, false],
        [missingFields, false],
        [corruptObject, false],
        [shortNickname, false],
        [aLongNickname, false],
        [shortNicknameValid, true],
        [aLongNicknameValid, true]
    ])('should validate - %p and return %p', (socketProfile, validation) => {
        expect(ValidationUtils.validateSocketProfile(socketProfile)).toBe(validation);
    });
});
