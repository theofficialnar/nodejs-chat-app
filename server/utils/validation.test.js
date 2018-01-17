const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        let name = isRealString(123);
        let room = isRealString(true);
        expect(room).toBe(false);
        expect(name).toBe(false);
    });

    it('should reject string with only spaces', () => {
        let name = room = isRealString('   ');
        expect(room).toBe(false);
        expect(name).toBe(false);
    });

    it('should allow strings with non-space characters', () => {
        let name = room = isRealString('  asdasd    22asd');
        expect(room).toBe(true);
        expect(name).toBe(true);
    });
});