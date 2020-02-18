
export function chat(socket, nsp) {
  socket.on("send message", function (sent_msg, callback) {
    sent_msg = "[ " + getCurrentDate() + " ]: " + sent_msg;
    console.log("inside chat controller send message ***",sent_msg)
    // console.log(socket)
    nsp.emit("update messages", sent_msg);
    callback();
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
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
}
