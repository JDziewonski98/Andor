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


io.on("connection", function (socket) {
	socket.on("send message", function (sent_msg, callback) {
		sent_msg = "[ " + getCurrentDate() + " ]: " + sent_msg;
		io.sockets.emit("update messages", sent_msg);
		callback();
	});


	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

function getCurrentDate() {
	var currentDate = new Date();
	var day = (currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate();
	var month = ((currentDate.getMonth() + 1) < 10 ? '0' : '') + (currentDate.getMonth() + 1);
	var year = currentDate.getFullYear();
	var hour = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
	var minute = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
	var second = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();

	return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
