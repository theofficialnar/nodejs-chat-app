var socket = io(); //initiate request from client to server to open a websocket

socket.on('connect', function () {
    console.log('Connected to Server.');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server.');
});

//listen for events from client - server to client
socket.on('newMessage', function (message) {
    console.log('New message received', message);
});