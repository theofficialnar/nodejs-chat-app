const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        var from = 'Rob';
        var text = 'Hey there!';
        var message = generateMessage(from, text);
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({
            from,
            text
        });
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        // pass from, lat, long
        // assert from, createdAt is number, url
        let from = 'Bob';
        let latitude = 14.5570142;
        let longitude = 121.0267571;
        var locationMessage = generateLocationMessage(from, latitude, longitude);
        expect(locationMessage.createdAt).toBeA('number');
        expect(locationMessage.from).toBe(from);
        expect(locationMessage.url).toBe(`https://www.google.com/maps?q=${latitude},${longitude}`);
    });
});