var express = require('express');
var socket = require("socket.io");
var app = express();
app.use(express.static(__dirname + '/static'));

var users = [];
var connections = [];

app.get('/Alerter/', function (req, res) {
  res.sendFile(__dirname + '/static/Alerter.html');
});

var server = app.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port 5000!');
});

var io = socket.listen(server);

io.of("/Alerter").on("connection", function(socket){
  connections.push(socket);
  console.log("Connected to " + socket.id + " There are currently " + connections.length + " connections")

  socket.on("msg", function(data){
    console.log(data);
    io.of("/Alerter").emit("msg",data);
    console.log("Emmited " + data);
  })

  socket.on("disconnect", function(socket){
    connections.splice(connections.indexOf(socket),1);
    console.log("Disconnected, there are now " + connections.length + " connections");
  });
});
