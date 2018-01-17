const {Users} = require('./users');
const expect = require('expect');

describe('Users', () => {
    let users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id : '1',
            name : 'John',
            room : 'Node'
        },{
            id : '2',
            name : 'Julie',
            room : 'React'
        },
        {
            id : '3',
            name : 'Rob',
            room : 'Node'
        }];
    });

    it('should add new user', () => {
        let users = new Users();
        let user = {
            id : '123',
            name : 'Bob',
            room : 'Red Room'
        };
        let resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should return names for node course', () => {
        let userList = users.getUserList('Node');
        expect(userList).toEqual(['John', 'Rob']);
    });

    it('should return names for react course', () => {
        let userList = users.getUserList('React');
        expect(userList).toEqual(['Julie']);
    });

    it('should remove a user', () => {
        let user = users.removeUser('2');
        expect(user.name).toBe('Julie');
        expect(users.users.length).toBe(2);
    });

    it('should not remove a user', () => {
        let user = users.removeUser('42');
        expect(user).toBe(undefined);
        expect(users.users.length).toBe(3);
    });

    it('should find a user', () => {
        let user = users.getUser('1');
        expect(user.id).toBe('1');
    });

    it('should not find a user', () => {
        let user = users.getUser('21');
        expect(user).toBe(undefined);
    });
});