// var app = require('http').createServer(response);
// var fs = require('fs');
// var io = require('socket.io')(app);

var express = require("express");
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, () => {
	console.log('Server listening at port %d', port);
});

// import controllers that we need from here
import { game, chat } from "./controller";
import { Game } from "./model"
import { GameDifficulty } from './model/GameDifficulty';

var gamensp = io.of("/game")
gamensp.on("connection", function (socket){
	var g = new Game(4, GameDifficulty.Easy)
	game(socket, gamensp, g)
});

var chatnsp = io.of("/chat")
chatnsp.on("connection", function (socket){
	chat(socket, chatnsp)
});