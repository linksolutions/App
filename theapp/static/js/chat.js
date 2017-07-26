var socket = io.connect();
var alias = sessionStorage.getItem("alias");
socket.on('connect', function () {
    var path = window.location.pathname.split('/');
    room = path[2];
    socket.emit('join', {
        alias: alias,
        room: room
    });
    document.getElementById("chat_room_name").innerHTML = room;
});

//Capture users joining
socket.on('join response', function (msg) {
    alertify.set('notifier', 'position', 'top-right');
    alertify.success(String(msg.alias) + " has joined the room");

    var audio = document.getElementById('sound');
    audio.src = '../static/content/connected.mp3';
    audio.load();
    audio.oncanplaythrough = function () {
        this.play();
    }
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var chosen_color = getRandomColor();



var form = $('form').on('submit', function (event) {
    // to allow for when the user hits enter
    event.preventDefault();
    var message = $('input.message').val();
    var path = window.location.pathname.split('/');
    room = path[2];

    socket.emit('message', {
        user: alias,
        msg: message,
        color: chosen_color,
        room: room
    });
    $('#chatinputbox').val('');
});

$(window).on('resize', function () {
    $('#chatbox').css('max-height', $(window).height() - 150);
});

// Capture new messages
socket.on('message response', function (msg) {
    if (typeof msg.user !== 'undefined') {
        $('h1').remove();
        $('div.message_holder').append('<div class="message_roll"><b style="color:' + msg.color + '">' + msg.user + ': </b>' + msg.msg + '</div>');
        $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
        $('#chatbox').css('max-height', $(window).height() - 150);
    }
});

$('#back_to_dashboard i').on('click', function (e) {
    linkLocation = "/dashboard";
    $("body").fadeOut(1000, redirectPage);
    function redirectPage() {
        window.location = linkLocation;
    }
});

$('#back_to_login i').on('click', function (e) {
    linkLocation = "/";
    $("body").fadeOut(1000, redirectPage);
    function redirectPage() {
        window.location = "/";
    }
});

$(window).on('load', function () {
    $('#table tr').eq(1).addClass('selected');
})

$(document).on('click', 'table #table-rows', function () {
    $("#table #table-rows").removeClass('selected');
    $(this).addClass('selected')
});

$('#join_room').on('click', function () {
    var room = String($("#table tr.selected td:nth-child(2)").html());
    linkLocation = "/chat/" + String(room);
    $("body").fadeOut(1000, redirectPage);
    function redirectPage() {
        window.location = linkLocation;
    }
});


function generateTable(vars) {
    var array = vars.split(',')
    var tbody = document.getElementById('table');
    for (var i = 0; i < array.length; i++) {
        var tr = "<tr id='table-rows'>";
        tr += "<td>" + parseInt(i+1) + "</td>" + "<td>" + array[i].replace(/[\[\]'\s]/g, '') + "</td></tr>";
        tbody.innerHTML += tr;
    }
}


