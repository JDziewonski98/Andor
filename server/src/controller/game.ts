import { Game } from 'src/model';

export function game(socket, nsp, model: Game) {
    socket.on("heroMove", function (heroId, callback) {
        let successful: boolean = false
        // any logic for movement here
        
        if(successful){
          nsp.emit("updateHeroMove", heroId);
        } else {
          // could emit event for handling failure move case here.
        }
        callback();
      });
  
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  }
  