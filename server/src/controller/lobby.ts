import { Lobby } from '../model';

export function lobby(socket, nsp, model: Lobby) {
    socket.on("", function (callback) {
        // detect a new player entered the game and add them to the list of players
    });
  
    socket.on('disconnect', function () {
      console.log('Lobby disconnected');
    });
  }
  