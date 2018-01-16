//initiate request from client to server to open a websocket
const socket = io();

function scrollToBottom() {
    // selectors
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');

    // heights
    let clientHeight = $('#messages').prop('clientHeight');
    let scrollTop = $('#messages').prop('scrollTop');
    let scrollHeight = $('#messages').prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    // scroll to bottom if user is near the bottom
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    };
};

socket.on('connect', function () {
    console.log('Connected to Server.');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server.');
});

//listen for events from client - server to client
socket.on('newMessage', function (message) {
    let template = $('#messageTemplate').html();
    let formattedTime = moment(message.createdAt).format('h:mm a');

    //render template dynamically with mustachejs
    let html = Mustache.render(template, {
        text : message.text,
        from : message.from,
        createdAt : formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    let template = $('#locationMessageTemplate').html();
    let formattedTime = moment(message.createdAt).format('h:mm a');

    let html = Mustache.render(template, {
        url : message.url,
        from : message.from,
        createdAt : formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
})

$('#messageForm').on('submit', function (e) {
    e.preventDefault();

    var messageTextbox = $('[name=message]');

    socket.emit('createMessage', {
        from : 'user',
        text : messageTextbox.val()
    }, function () {
        messageTextbox.val('');
    });
});

var locationButton = $('#sendLocation');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    // find coordinates of user
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        })
    }, function (error) {
        alert('Unable to fetch location.');
        locationButton.removeAttr('disabled').text('Send location');
    });
});