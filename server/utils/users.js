class Users {
    constructor () {
        this.users = [];
    }

    addUser (id, name, room, callback) {
        let duplicateName = this.users.filter((user) => user.name === name && user.room === room);

        if (duplicateName.length > 0) {
            return callback('Username already taken.');
        }

        let user = {id, name, room};
        this.users.push(user);
        return user;
    }

    getUser (id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList (room) {
        let users = this.users.filter((user) => user.room === room);
        let namesArray = users.map((user) => user.name);
        return namesArray;
    }

    removeUser (id) {
        let user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id)
        }

        return user;
    }

}

module.exports = {Users};