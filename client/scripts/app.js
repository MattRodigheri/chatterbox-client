var app = {};

$('document').ready(function() { 
  app.init();
  $('#send .submit').on('submit', function() {
    app.handleSubmit();
  });
});

app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
app.storage = [];
app.user = {};
app.user.friends = {};
app.user.currentRoom;
app.rooms = [];

app.init = function(data) {
  $('.username').on('click', function() { app.handleUsernameClick(); });
  $('.roomSubmit').on('click', function() {
    var roomName = $('.roomInput').val();
    app.createRoom(roomName);
    $('.roomInput').val('');
  });
  app.fetch();
  app.addEventListeners();
  app.user.currentRoom = 'selectRoom';
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
    data: 'order=-createdAt',
    success: function (data) {
      console.log('chatterbox: Message recieved');
      app.storage = data;
      app.refreshFeed(data);
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
  var scriptTag = RegExp('script');
  if (scriptTag.test(message.text) || scriptTag.test(message.username)) { 
    return; 
  }

  if (app.user.currentRoom !== message.roomname && app.user.currentRoom !== 'selectRoom') {
    return;
  }

  var usernameNode = $(`<span class="username"> ${message.username} </span>`);

  if (app.user.friends.hasOwnProperty(message.username)) {
    usernameNode = $(`<span class="username"> <b> ${message.username} </b> </span>`);
  }

  var textNode = $(`<span> <p> ${message.text} ${message.createdAt} </p> </span>`);
  $('#chats').append(usernameNode);
  usernameNode.append(textNode);
  return usernameNode;
};

app.renderRoom = function(room) {
  var node = $(`<div> <p> ${room} </p> </div>`);
  $('#roomSelect').append(node);
};

app.handleUsernameClick = function(message) {
  app.user.friends[message.username] = 1;
  app.fetch();
};

app.submitMessage = function() {
  var username = $('.usernameInput').val();
  var text = $('.messageInput').val();
  var date = new Date();
  var messageObj = {username: username, text: text, createdAt: date, roomname: app.user.currentRoom};
  app.send(messageObj);
  $('.usernameInput').val('');
  $('.messageInput').val('');
  app.fetch();
};

app.handleSubmit = function() {
};

app.addEventListeners = function() {
  $('.submit').on('click', function() {
    app.submitMessage();
    app.handleSubmit();
    console.log('submit');
  });
  $('.rooms').on('change', function(event) {
    app.user.currentRoom = $(this).val();
    app.fetch();
  });
};

app.refreshFeed = function(messages) {
  app.clearMessages();
  var messages = app.storage.results;
  messages.forEach(function(message) {
    var node = app.renderMessage(message);
    if (node) { 
      node.click(app.handleUsernameClick.bind(app, message));
    }
  });
  app.createRoomsFromMessages();
};

app.createRoomsFromMessages = function() {
  var messages = app.storage.results;
  app.rooms.push('selectRoom');
  messages.forEach(function(message) {
    if (message.hasOwnProperty('roomname')) {
      if (message.roomname !== '' && !app.rooms.includes(message.roomname)) {
        app.createRoom(message.roomname);
      }
    }
  });
}

app.createRoom = function(roomName) {
  var node = `<option value="${roomName}" class="${roomName}">${roomName}</option>`
  $('.rooms').append(node);
  app.rooms.push(roomName); 
}