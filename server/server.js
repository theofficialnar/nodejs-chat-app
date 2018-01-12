const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

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
    socket.emit('newMessage', {
        from : 'Admin',
        text : 'Welcome to the Chat App!',
        createdAt : new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from : 'Admin',
        text : 'A new user has joined.',
        createdAt : new Date().getTime()
    });
    
    //client to server
    socket.on('createMessage', (message) => {
        console.log('New message received', message);

        //emits an event to all connections
        io.emit('newMessage', {
            from : message.from,
            text : message.text,
            createdAt : new Date().getTime()
        });

        //sends to everybody but the sender
        // socket.broadcast.emit('newMessage', {
        //     from : message.from,
        //     text : message.text,
        //     createdAt : new Date().getTime()
        // });
    });

    socket.on('disconnect', () => {
        console.log('User has disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});