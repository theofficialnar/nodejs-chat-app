const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

//configure server to use socket.io
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

//register an event listener called connection
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //socket.emit from admin text welcome to the chat app - only to user who joined
        //socket broadcast, from admin text new user joined - everybody but the user who joined
        socket.emit('newMessage', generateMessage('Chatbot', 'Welcome to the chat app.'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Chatbot', `${params.name} has joined.`));
        callback();
    });

    //client to server
    socket.on('createMessage', (message, callback) => {
        let user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        //runs callback when data is received
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name,coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        let removedUser = users.removeUser(socket.id);  
        if (removedUser) {
            //remove user on log out
            io.to(removedUser.room).emit('updateUserList', users.getUserList(removedUser.room));
            io.to(removedUser.room).emit('newMessage', generateMessage('Chatbot', `${removedUser.name} has left the chat.`));
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});