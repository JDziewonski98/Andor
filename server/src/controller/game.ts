import { Game, HeroKind, Region, Hero } from '../model';

export function game(socket, model: Game) {

  socket.on("moveRequest", function (tile, callback) {
    console.log("Recieved moveRequest")
    let canMove: boolean = false
    /* currently does not work 
    var heroId = socket.conn.id
    let hero = model.getHero(heroId);
    console.log(hero)
    for(var id in hero.getRegion().getAdjRegionsIds()){
      if(model.getRegions()[id] === tile){
        console.log("Can move from tile: ", tile.id, " to tile: ", id)
      }
  }
    /*
    
    // any logic for movement here

    if (canMove) {
      socket.broadcast.emit("updateHeroMove", heroId);
    } else {
      // could emit event for handling failure move case here.
    }
    callback();
   */
  });

  socket.on("pickupFarmer", function (callback) {
    let success = false;
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    if (hero !== undefined) {
      success = hero.pickupFarmer();
    }

    if (success) {
      socket.broadcast.emit("updateFarmer");
      callback();
    }
  });

  socket.on('bind hero', function (heroType, callback) {
    let success = false;
    let id = socket.conn.id;

    if (heroType === "archer")
      success = model.bindHero(id, HeroKind.Archer);

    else if (heroType === "warrior")
      success = model.bindHero(id, HeroKind.Warrior);
    else if (heroType === "mage")
      success = model.bindHero(id, HeroKind.Mage);
    else if (heroType === "dwarf")
      success = model.bindHero(id, HeroKind.Dwarf);

    if (success) {
      let remaining = model.getAvailableHeros();
      let heros = {
        taken: ["archer", "warrior", "mage", "dwarf"].filter(f => !remaining.toString().includes(f)),
        remaining: remaining
      }
      socket.broadcast.emit("updateHeroList", heros)
      callback(heros);
    }

  });

  socket.on('disconnect', function () {
    console.log('user disconnected', socket.conn.id, ' in game.');
    // model.removePlayer(socket.conn.id);
  });


  /*
   * CHAT RELATED
   */
  socket.on("send message", function (sent_msg, callback) {
    console.log(socket.conn.id, "said: ", sent_msg)
    let raw_sent_msg = sent_msg
    let name = ""
    let heroID = socket.conn.id;
    let hero: Hero = model.getHero(heroID);
    if(hero !== undefined){
      name = hero.hk;
    } else {
      name = getCurrentDate()
    }
    sent_msg = "[ " + name + " ]: " + sent_msg;
    //model.pushToLog({ author: socket.conn.id, datestamp: datestamp, content: raw_sent_msg })
    socket.broadcast.emit("update messages", sent_msg);
    callback(sent_msg);
  });

  socket.on('removeListener', function (object) {
    console.log('removing ', object)
    socket.broadcast.emit('removeObjListener', object)
  })

  socket.on('playerReady', function () {
    model.readyplayers += 1;
    console.log('ready players: ', model.readyplayers)
    socket.broadcast.emit('recieveDesiredPlayerCount', model.getNumOfDesiredPlayers())
  })

  socket.on('getReadyPlayers', function () {
    socket.broadcast.emit('sendReadyPlayers', model.readyplayers)
    socket.emit('sendReadyPlayers', model.readyplayers)
  })

  socket.on('getDesiredPlayerCount', function () {
    socket.broadcast.emit('recieveDesiredPlayerCount', model.getNumOfDesiredPlayers())
    socket.emit('recieveDesiredPlayerCount', model.getNumOfDesiredPlayers())
  })

  socket.on("dropGold", function (callback) {
    // TODO:
    callback()
  })

  socket.on("getHeros", function (callback) {
    let heros = new Array<HeroKind>();
    model.getHeros().forEach((hero, key) => { heros.push(hero.hk) });
    if (heros.length !== 0)
      callback(heros);
  })

  // Collaborative decision making
  
  // Submitting a decision
  socket.on('collabDecisionSubmit', function() {
    // Check that numAccepts equals total num of players-1
    if (model.numAccepts == model.getNumOfDesiredPlayers()-1) {
      // Success: distribute accordingly
      // Reset decision related state
      model.numAccepts = 0;
      socket.broadcast.emit('sendDecisionSubmitSuccess')
      socket.emit('sendDecisionSubmitSuccess')
    } else {
      // Failure: need more accepts before valid submit
      socket.emit('sendDecisionSubmitFailure')
    }
  })

  // Accepting a decision
  socket.on('collabDecisionAccept', function () {
    model.numAccepts += 1;
    console.log('number of players accepted decision: ', model.numAccepts)
    // Tell the client that accepted to update their status
    socket.emit('sendDecisionAccepted', model.numAccepts)
  })

  function getCurrentDate() {
    var currentDate = new Date();
    var hour = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
    var minute = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
    var second = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();

    return hour + ":" + minute + ":" + second;
  }


}

