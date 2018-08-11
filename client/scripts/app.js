var app = {};

$('document').ready(function() { app.fetch(); });

app.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';

app.init = function(data) {
  var messages = data.results;
  app.refreshFeed(messages);
  app.addEventListeners();
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
  return $.ajax({
    url: app.server,
    type: 'GET',
    success: function (data) {
      console.log('chatterbox: Message recieved');
      app.init(data);
      return data;
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
  var usernameNode = $(`<span class="username"> <p> ${message.username} </p> </span>`);
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
  messages.forEach(function(message) {
    var node = app.renderMessage(message);
    node.on('click', app.handleUsernameClick);
  });
};
