import { Game } from 'src/model';

export function game(socket, model: Game) {
  
  socket.on("heroMove", function (heroId, callback) {
    let successful: boolean = false
    // any logic for movement here

    if (successful) {
      socket.broadcast.emit("updateHeroMove", heroId);
    } else {
      // could emit event for handling failure move case here.
    }
    callback();
  });

  socket.on('disconnect', function () {
    console.log('user disconnected', socket.conn.id, ' in game.');
  });

  socket.on("send message", function (sent_msg, callback) {
    console.log(socket.conn.id, "said: ", sent_msg)
    let datestamp = getCurrentDate()
    sent_msg = "[ " + datestamp + " ]: " + sent_msg;
    socket.broadcast.emit("update messages", sent_msg);
    callback(sent_msg);
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

