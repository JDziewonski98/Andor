import { Lobby, Game, GameDifficulty, Player } from '../model';
import { game } from '.';


export function lobby(socket, model: Lobby, io) {
  socket.on("createGame", function (name, numPlayers, difficulty) {
    const d = difficulty === "Easy" ? GameDifficulty.Easy : GameDifficulty.Hard;
    let g = new Game(name, numPlayers, d);
    model.createGame(g);
    console.log("Created game", name, "with", numPlayers, "players");

    var gamensp = io.of("/" + name)
    gamensp.on("connection", function (socket) {
      game(socket, g)
    });

  })

  socket.on("getGames", function (callback) {
    let games = model.getAvailableGames();
    let filteredGames = Array<String>()
    games.forEach((g, k) => {
      if (g.getNumOfDesiredPlayers() > g.getPlayers().size) {
        filteredGames.push(k)
      }
    })
    console.log(Object.keys(io.nsps))
    callback(filteredGames)
  })

  socket.on("newPlayer", function () {
    let id = model.connectNewPlayer(socket.conn.id)
    console.log(model.getPlayers());
  });

  socket.on("joinGame", function (gameName, callback) {
    let games = model.getAvailableGames()
    if (games.has(gameName)) {
      let g: Game = <Game> games.get(gameName);
      if (g.getNumOfDesiredPlayers() > g.getPlayers().size) {
        g.addPlayer(<Player> model.getPlayers().get(socket.conn.id))
        console.log("Added", socket.conn.io, " to ", g.getName())
        console.log(g)
      }
    }
  })

  socket.on('disconnect', function (x) {
    let id = socket.conn.id
    model.disconnectPlayer(socket.conn.id)
    console.log('Lobby disconnected', id);
    console.log('remaining players: ', model.getPlayers())
  });



}
