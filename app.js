var bodyParser = require("body-parser");
var express = require("express");
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;


server.listen(port, function(){
    console.log("listening on port 3000");
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var numUsers = 0;

//--------------------------------------------------

io.on('connection', function(socket){

    //VIDEO========================================
    
    io.to(socket.handshake.query.roomName).emit('newUser');
    socket.join(socket.handshake.query.roomName, function(){
        io.to('${socketId}').emit('newUser');
    });
    socket.on('requestCurrentVideo', function(){
        //emit a signal that asks for current videoID and time
    });
    socket.on('play', function(room){
        console.log('State: play');
        io.to(room).emit('playPlayer');
    });
    socket.on('pause', function(room){
        console.log('State: pause');
        io.to(room).emit('pausePlayer');
    });
    socket.on('buffering', function(time, room){
        console.log('State: buffering: '+time);
        io.to(room).emit('bufferingPlayer', time);
    });
    socket.on('playback', function(rate, room){
        console.log('Playback change: '+rate);
        io.to(room).emit('playbackPlayer', rate);
    });
    socket.on('newVideo', function(url, room){
        console.log('New Video!');
        console.log(url);
        var newVideoID = url.split('v=')[1];
        io.to(room).emit('newVideo', newVideoID);
    });

    //CHAT===========================================

    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', (data) => {
      // we tell the client to execute 'new message'
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: data
      });
    });
  
    // when the client emits 'add user', this listens and executes
    socket.on('add user', (username) => {
      if (addedUser) return;
  
      // we store the username in the socket session for this client
      socket.username = username;
      ++numUsers;
      addedUser = true;
      socket.emit('login', {
        numUsers: numUsers
      });
      // echo globally (all clients) that a person has connected
      socket.broadcast.emit('user joined', {
        username: socket.username,
        numUsers: numUsers
      });
    });
  
    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
      socket.broadcast.emit('typing', {
        username: socket.username
      });
    });
  
    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
      socket.broadcast.emit('stop typing', {
        username: socket.username
      });
    });
  
    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
      if (addedUser) {
        --numUsers;
  
        // echo globally that this client has left
        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: numUsers
        });
      }
    });
});

//--------------------------------------------------

app.get('/', function (req, res) {
  res.render(__dirname + '/views/index.ejs');
});

app.post("/", function(req, res){
    var roomName = req.body.roomName;

    res.redirect("/room/" + roomName);
});

app.get("/room/:id", function(req, res){
    res.render("room", {roomName: req.params.id});
});

app.get('/', function (req, res) {
    res.send("404 Error");
});