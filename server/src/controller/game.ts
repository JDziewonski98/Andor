import { Game } from 'src/model/game';

export function game(socket, nsp, model: Game) {
    socket.on("heroMove", function (heroId, callback) {
        nsp.emit("updateHeroMove", heroId);
        callback();
      });
  
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  }
  