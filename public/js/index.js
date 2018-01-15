//initiate request from client to server to open a websocket
var socket = io(); 

socket.on('connect', function () {
    console.log('Connected to Server.');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server.');
});

//listen for events from client - server to client
socket.on('newMessage', function (message) {
    console.log('New message received', message);
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    $('#messages').append(li);
});

$('#messageForm').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from : 'user',
        text : $('[name=message]').val()
    }, function () {

    });
});