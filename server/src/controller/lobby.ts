import { Lobby, Game, Player, Fog } from '../model';
import { game } from '.';
import { jsonToMap } from "../utils/helpers";


export function lobby(socket, model: Lobby, io) {
  socket.on("createGame", function (name, numPlayers, difficulty) {
    numPlayers = +numPlayers
    let g = new Game(name, numPlayers, difficulty);
    g.initialize({});
    model.createGame(g);

    var gamensp = io.of("/" + name)
    gamensp.on("connection", function (socket) {
      game(socket, g, io)
    });

  })

  socket.on("loadGame", function (name, callback) {
    var fs = require('fs');
    const tempData = fs.readFileSync('db.json')
    const data = JSON.parse(tempData);
    if (data.games && name in data.games) {
      const gameData = data.games[name];

      // create game
      let g = new Game(name, gameData.numOfDesiredPlayers, gameData.difficulty);
      model.createGame(g);
      // connect game socket
      var gamensp = io.of("/" + name)
      gamensp.on("connection", function (socket) {
        game(socket, g, io)
      });

      g.initialize({
        currPlayersTurn: gameData.currPlayersTurn,
        regions: JSON.parse(gameData.regions, (key, value) =>
          key === 'items' ? jsonToMap(value) : value
        ),
        heros: JSON.parse(gameData.heros),
        farmers: JSON.parse(gameData.farmers),
        monsters: JSON.parse(gameData.monsters),
        fogs: jsonToMap(gameData.fogs),
        eventDeck: JSON.parse(gameData.eventDeck),
        activeEvents: JSON.parse(gameData.activeEvents),
        nextDayFirstHero: gameData.nextDayFirstHero,
        activeHeros: JSON.parse(gameData.activeHeros),
        castle: JSON.parse(gameData.castle),
        monstersInCastle: JSON.parse(gameData.monstersInCastle),
        endOfGameState: gameData.endOfGameState,
        prince: JSON.parse(gameData.prince),
        witch: JSON.parse(gameData.witch),
        narrator: JSON.parse(gameData.narrator),
        initialCollabDone: gameData.initialCollabDone,
        runestoneCardPos: gameData.runestoneCardPos
      })
      callback();
    }
  })

  socket.on("getGames", function (callback) {
    let games = model.getAvailableGames();
    let filteredGames = Array<String>()
    games.forEach((g, k) => {
      if (g.getNumOfDesiredPlayers() > g.getHeros().size) {
        filteredGames.push(k)
      }
    })
    callback(filteredGames)
  })

  socket.on("newPlayer", function () {
    let id = model.connectNewPlayer(socket.conn.id);
    console.log("Connected ", id);
  });

  socket.on("joinGame", function (gameName, callback) {
    let games = model.getAvailableGames()
    if (games.has(gameName)) {
      let g: Game = <Game>games.get(gameName);
      if (g.getNumOfDesiredPlayers() > g.getHeros().size) {
        g.addPlayer(<Player>model.getPlayers().get(socket.conn.id))
      }
    }
  })

  socket.on('disconnect', function (x) {
    const id = socket.conn.id
    model.disconnectPlayer(id)
    console.log(id, " disconnected in lobby!!!!")
  });



}
