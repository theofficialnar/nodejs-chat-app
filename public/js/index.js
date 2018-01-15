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

socket.on('newLocationMessage', function (message) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My location.</a>')
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    $('#messages').append(li);
})

$('#messageForm').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from : 'user',
        text : $('[name=message]').val()
    }, function () {

    });
});

var locationButton = $('#sendLocation');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }

    // find coordinates of user
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        })
    }, function (error) {
        alert('Unable to fetch location.');
    });
});