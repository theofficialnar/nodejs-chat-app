const socket = io();

$(window).on('load', function () {
    $('.centered-form__form').hide();
    $('.chatroom__active').hide();

    $('#createChatTrigger').on('click', function () {
        //console.log('Triggered');
        $('.chatroom__selection').hide();
        $('.centered-form__form').show();
    });

    $('#createChatBack').on('click', function (e) {
        e.preventDefault();
        $('.chatroom__selection').show();
        $('.centered-form__form').hide();
    });

    $('#joinChatTrigger').on('click', function () {
        $('.chatroom__selection').hide();
        $('.chatroom__active').show();
    });

    $('#joinChatBack').on('click', function (e) {
        e.preventDefault();
        $('.chatroom__selection').show();
        $('.chatroom__active').hide();
    });
});

socket.on('updateRoomList', function (message) {
    console.log(message);
    let select = $('<select name="room"></select>');

    message.forEach(function (room) {
        select.append($(`<option value="${room}"></option>`).text(room));
    });
    $('#activeChatSelect').html(select);
    
});