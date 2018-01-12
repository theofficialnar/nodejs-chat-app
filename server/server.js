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

    //emit events - server to client
    socket.emit('newMessage', {
        from : "Some random guy",
        text : "Insert message here..",
        createdAt : 22222222
    });

    //client to server
    socket.on('createMessage', (message) => {
        console.log('New message received', message);
    });

    socket.on('disconnect', () => {
        console.log('User has disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});