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

  socket.on('bind hero', function (herotype, callback) {
    let success = !false;
    
    console.log('player ', socket.conn.id, ' chose ', herotype)
    let availableHeros = [];
    if(success){
      socket.broadcast.emit("updateHeroList", availableHeros)
      callback(availableHeros);
    }
    
  });

  socket.on('disconnect', function () {
    console.log('user disconnected', socket.conn.id, ' in game.');
    model.removePlayer(socket.conn.id);
  });


  /*
   * CHAT RELATED
   */
  socket.on("send message", function (sent_msg, callback) {
    console.log(socket.conn.id, "said: ", sent_msg)
    let raw_sent_msg = sent_msg
    let datestamp = getCurrentDate()
    sent_msg = "[ " + datestamp + " ]: " + sent_msg;
    model.pushToLog({ author: socket.conn.id, datestamp: datestamp, content: raw_sent_msg })
    socket.broadcast.emit("update messages", sent_msg);
    callback(sent_msg);
  });

  socket.on("getChatLog", function (callback) {
    callback(model.getChatLog())
  })

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

