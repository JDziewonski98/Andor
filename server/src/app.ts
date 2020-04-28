var express = require("express");
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000;

// server.listen()

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

server.listen(port, '0.0.0.0');

// import controllers that we need from here
import { lobby } from "./controller";
import { Lobby } from "./model"

var lobbynsp = io.of("/lobby")
var l = new Lobby()
lobbynsp.on("connection", function (socket){
	lobby(socket, l, io)
});

// for mac users
// console.log(require('os').networkInterfaces()['en0'][1]['address'])

// for windows users
//console.log(require('os').networkInterfaces())
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
	console.log('addr: '+add);
  })