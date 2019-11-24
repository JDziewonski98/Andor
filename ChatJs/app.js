// /**
// The script creates an HTTP server (which will be listening on port 3000) which has as main method to be requested the response() function,
// which, in turn, has two parameters: req (request) and res (response).
// Into the function, we define a success code (200) and end it with a string warning that the server is ok.
// */
//
// // var app = require('http').createServer(response);
// // app.listen(3000);
// // console.log("App running…");
// // function response(req, res) {
// //  res.writeHead(200);
// //  res.end("Hi, your server is working!");
// // }
//
// /*
// we will make our server present an HTML response that will be the main page of our chat.
// For this, we will have to load the FileSystem module, since we will navigate the project directory and open a file.
// */
// // var app = require('http').createServer(response);
// // var fs = require('fs');
// // app.listen(3000);
// // console.log("App running…");
// // function response(req, res) {
// //  fs.readFile(__dirname + '/index.html',
// //  function (err, data) {
// //  if (err) {
// //    res.writeHead(500);
// //    return res.end('Failed to load file index.html');
// //  }
// //  res.writeHead(200);
// //    res.end(data);
// //  });
// // }
//
//
// /*
// The reason is that our app.js only deals with a request path so far.
// To solve this we will change our app.js file so that it loads the files that are passed in the request URL,
// instead of placing each of the URLs manually
// */
//
// var app = require('http').createServer(response);
// var fs = require('fs');
// var io = require('socket.io')(app);
//
// app.listen(3000);
// console.log("App running...");
//
// function response(req, res) {
//     var file = "";
//     if (req.url == "/") {
//         file = __dirname + '/index.html';
//     } else {
//         file = __dirname + req.url;
//     }
//
//     fs.readFile(file, function(err, data) {
//         if (err) {
//             res.writeHead(404);
//             return res.end('Page or file not found');
//         }
//     res.writeHead(200);
//         res.end(data);
//     });
// }
//
// io.on("connection", function(socket) {
//     socket.on("send message", function(sent_msg, callback) {
//         sent_msg = "[ " + getCurrentDate() + " ]: " + sent_msg;
//         io.sockets.emit("update messages", sent_msg);
//         callback();
//     });
// });
//
//
// function getCurrentDate() {
//     var currentDate = new Date();
//     var day = (currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate();
//     var month = ((currentDate.getMonth() + 1) < 10 ? '0' : '') + (currentDate.getMonth() + 1);
//     var year = currentDate.getFullYear();
//     var hour = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
//     var minute = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
//     var second = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();
//     return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
// }


var app = require('http').createServer(response);
var fs = require('fs');
var io = require('socket.io')(app);

app.listen(3000);
console.log("App running...");

function response(req, res) {
    var file = "";
    if(req.url == "/"){
	   file = __dirname + '/index.html';
    } else {
	   file = __dirname + req.url;
    }

    fs.readFile(file,
	    function (err, data) {
			if (err) {
				res.writeHead(404);
				return res.end('Page or file not found');
			}

			res.writeHead(200);
			res.end(data);
	    }
    );
}

io.on("connection", function(socket){
    socket.on("send message", function(sent_msg, callback){
		sent_msg = "[ " + getCurrentDate() + " ]: " + sent_msg;

		io.sockets.emit("update messages", sent_msg);
		callback();
    });
});

function getCurrentDate(){
	var currentDate = new Date();
	var day = (currentDate.getDate()<10 ? '0' : '') + currentDate.getDate();
	var month = ((currentDate.getMonth() + 1)<10 ? '0' : '') + (currentDate.getMonth() + 1);
	var year = currentDate.getFullYear();
	var hour = (currentDate.getHours()<10 ? '0' : '') + currentDate.getHours();
	var minute = (currentDate.getMinutes()<10 ? '0' : '') + currentDate.getMinutes();
	var second = (currentDate.getSeconds()<10 ? '0' : '') + currentDate.getSeconds();

	return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
