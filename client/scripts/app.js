var app = {};

$('document').ready(function() { 
  app.init();
  $('#send .submit').on('submit', function() {
    app.handleSubmit();
  });
});

app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
app.storage = [];
app.rooms = [];

app.init = function(data) {
  $('.username').on('click', function() { app.handleUsernameClick(); });
  $('.roomSubmit').on('click', function() {
    var roomName = $('.roomInput').val();
    app.createRoom(roomName);
    $('.roomInput').val('');
  });
  app.fetch();
  setTimeout(app.refreshFeed, 200);
};

app.send = function(message) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    success: function (data) {
      console.log('chatterbox: Message recieved');
      app.storage = data;
    },
    error: function (data) {
      console.error('chatterbox: Failed to recieve message', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(message) {
  var usernameNode = $(`<span class="username"> ${message.username} </span>`);
  var textNode = $(`<span> <p> ${message.text} </p> </span>`);
  $('#chats').append(usernameNode);
  usernameNode.append(textNode);
  app.send(message);
  return usernameNode;
};

app.renderRoom = function(room) {
  var node = $(`<div> <p> ${room} </p> </div>`);
  $('#roomSelect').append(node);
};

app.handleUsernameClick = function() {
  console.log('test');
};

app.submitMessage = function() {
  var username = $('.usernameInput').val();
  var text = $('.messageInput').val();
  var date = new Date();
  var messageObj = {username: username, text: text};
  app.renderMessage(messageObj);
  $('.usernameInput').val('');
  $('.messageInput').val('');
};

app.handleSubmit = function() {
};

app.addEventListeners = function() {
  $('.submit').on('click', function() {
    app.submitMessage();
    app.handleSubmit();
  });
};

app.refreshFeed = function(messages) {
  var messages = app.storage.results;
  messages.forEach(function(message) {
    var node = app.renderMessage(message);
    node.click(app.handleUsernameClick);
  });
  app.createRoomsFromMessages();
};

app.createRoomsFromMessages = function() {
  var messages = app.storage.results;
  messages.forEach(function(message) {
    if (message.hasOwnProperty('roomname')) {
      if (message.roomname !== '' && !app.rooms.includes(message.roomname)) {
        app.createRoom(message.roomname);
      }
    }
  });
}

app.createRoom = function(roomName) {
  var node = `<option value="">${roomName}</option>`
  $('.rooms').append(node);
  app.rooms.push(roomName); 
}