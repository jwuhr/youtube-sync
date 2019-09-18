var bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    // passport       = require("passport"),
    cookieParser   = require("cookie-parser"),
    // LocalStrategy  = require("passport-local"),
    flash          = require("connect-flash"),
    session        = require("express-session"),
    methodOverride = require("method-override");
    methodOverride = require("method-override");

var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

app.use(session({
    secret: 'dog',
    resave: false,
    saveUninitialized: false
}));

server.listen(port, function(){
    console.log("listening on port 3000");
});

app.use(bodyParser.urlencoded({extended: true}));
// app.engine('html', require('ejs').renderFile);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//--------------------------------------------------

io.on('connection', function(socket){
    io.to(socket.handshake.query.roomName).emit('newUser', socket.handshake.query.userName);
    socket.join(socket.handshake.query.roomName, function(){
        io.to('${socketId}').emit('newUser');
    });
    // socket.on('end', function(){
    //     console.log('State: end');
    // });
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
    // socket.on('status5', function(time){
    //     console.log('5');
    // });
    // socket.on('statusminus1', function(time){
    //     console.log('-1');
    //     // io.emit('pausePlayer');
    // });
    socket.on('newVideo', function(url, room){
        console.log('New Video!');
        var newVideoID = url.split('v=')[1];
        io.to(room).emit('newVideo', newVideoID);
    });
});

//--------------------------------------------------

app.get('/', function (req, res) {
  res.render(__dirname + '/views/index.ejs');
});

app.post("/", function(req, res){
    var roomName = req.body.roomName;
    var username = req.body.username;

    res.redirect("/room/" + roomName + "/?user=" + username);
});

app.get("/room/:id", function(req, res){
    res.render("room", {roomName: req.params.id, username: req.query.user});
});

app.get('/', function (req, res) {
    res.send("404 Error");
});










// mongoose.Promise = global.Promise;
// const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-sync';

// mongoose.connect(databaseUri, { useNewUrlParser: true })
//       .then(() => console.log(`Database connected`))
//       .catch(err => console.log(`Database connection error: ${err.message}`));

// app.use(bodyParser.urlencoded({extended: true}));
// app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));
// app.use(methodOverride('_method'));
// app.locals.moment = require('moment');

// var server = app.listen(3000, function(){
//     console.log("Server listening on port 3000");
// });

// var io = socket(server);

// io.on("connection", function(socket){
//     console.log("Made socket connection");
// });

// app.get("/", function(req, res){
//     res.render("index");
// });
















// // ----------Functions-------------------------------------

// function getVideos() {
//     var query = document.getElementById('url').value;
//     $.ajax({
//       url: '/youtube_query',
//       type: 'POST',
//       cache: false, 
//       data: {query: query}, 
//       success: function(data){
//         document.getElementById('videoResults').innerHTML=data;
//       }, 
//       error: function(jqXHR, textStatus, err){}
//    })
// }
// // 2. This code loads the IFrame Player API code asynchronously.
// var tag = document.createElement('script');
// tag.src = "https://www.youtube.com/player_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// // 3. This function creates an <iframe> (and YouTube player)
// //    after the API code downloads.
// var player;
// function onYouTubePlayerAPIReady() {
// player = new YT.Player('ytplayer', {
//   width:800,
//   height:500,
//   events: {
//     'onStateChange': onPlayerStateChange,
//     'onReady': onPlayerReady,
//     'onPlaybackRateChange': onPlaybackRateChange
//   }
// });
// }
// // 4. The API will call this function when the video player is ready.
// function onPlayerReady(event) {
//     // do stuff here if necessary
// }