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
import { game, chat, lobby } from "./controller";
import { Lobby } from "./model"

var lobbynsp = io.of("/lobby")
var l = new Lobby()
lobbynsp.on("connection", function (socket){
	lobby(socket, l, io)
});

//var os = require('os')
//var n = os.networkInterfaces();
// console.log(n)
//console.log(n['en0'][1]['address'])

var chatnsp = io.of("/asd")
chatnsp.on("connection", function (socket){
	chat(socket)
});


