var express = require('express');
var socket = require("socket.io");
var app = express();
app.use(express.static(__dirname + '/static'));

//web gateways
app.get('/Alerter/', function (req, res) {
  res.sendFile(__dirname + '/static/Alerter.html');
});
app.get('/Draw/', function (req, res) {
  res.sendFile(__dirname + '/static/Draw.html');
});

var server = app.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port 5000!');
});

//Socket Listeners
var io = socket.listen(server);
io.of("/Alerter").on("connection", function(socket){
  socket.on("msg", function(data){
    console.log(data);
    io.of("/Alerter").emit("msg",data);
    console.log("Emmited " + data);
  })
});

strokes = []
io.of("/Draw").on("connection", function(socket){
  console.log("New Connection To Draw");

  socket.on("newstroke", function(data){
    // console.log(data);
    if (data[1].length != 0){
      strokes.push(data);
      io.of("/Draw").emit("newstroke",data);
      console.log("Emmited to draw");
    }
  })

  socket.on("start",function(data){
    socket.emit("start", strokes);
  })
  socket.on("disconnect",function(){
    console.log("Disconnected");
  })
});
