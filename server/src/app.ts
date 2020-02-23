var express = require("express");
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

server.listen(port, () => {
	console.log('Server listening at port %d', port);
});

// import controllers that we need from here
import { game, chat, lobby } from "./controller";
import { Lobby } from "./model"

var lobbynsp = io.of("/lobby")
var l = new Lobby()
lobbynsp.on("connection", function (socket){
	lobby(socket, l, io)
});

var chatnsp = io.of("/chat")
chatnsp.on("connection", function (socket){
	chat(socket)
});

