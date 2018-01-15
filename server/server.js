const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);

//configure server to use socket.io
var io = socketIO(server);

app.use(express.static(publicPath));

//register an event listener called connection
io.on('connection', (socket) => {
    console.log('New user connected');

    //socket.emit from admin text welcome to the chat app - only to user who joined
    //socket broadcast, from admin text new user joined - everybody but the user who joined
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app.'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has connected to the chat.'));

    //client to server
    socket.on('createMessage', (message, callback) => {
        console.log('New message received', message);

        //emits an event to all connections
        io.emit('newMessage', generateMessage(message.from, message.text));

        //runs callback when data is received
        callback('This is from the server.');
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        console.log('User has disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});