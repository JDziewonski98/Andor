import { Lobby, Game, GameDifficulty } from '../model';

export function lobby(socket, nsp, model: Lobby) {
  socket.on("createGame", function (numPlayers, difficulty) {
    const d = difficulty === "Easy" ? GameDifficulty.Easy : GameDifficulty.Hard;
    let g = new Game(numPlayers, d);
    model.createGame(g);

    // TODO create namespace for game instance and connect it to socket.io
    
    // var gamensp = io.of("/game")
    // gamensp.on("connection", function (socket) {
    //   var g = new Game(4, GameDifficulty.Easy)
    //   game(socket, gamensp, g)
    // });
  })


  socket.on("newPlayer", function () {
    let id = model.connectNewPlayer(socket.conn.id)
    console.log(id, " just joined");
  });

  socket.on('disconnect', function (x) {
    model.disconnectPlayer(socket.conn.id)
    console.log('Lobby disconnected', model.getPlayers());
  });
}
