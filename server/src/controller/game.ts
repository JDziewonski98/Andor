
//server controller

import { Game, HeroKind, Region, Hero, Monster } from '../model';

export function game(socket, model: Game, io) {

  socket.on("moveRequest", function (id, callback) {
    id = +id // turning Id from string to number
    var heroID = socket.conn.id
    let hero = model.getHero(heroID);

    if (hero !== undefined) {
      var currRegion: Region = hero.getRegion()
      var adjRegions: Array<number> = currRegion.getAdjRegionsIds()

      for (var regionID of adjRegions) {
        var timeLeft = hero.getTimeOfDay() <= 7 || (hero.getTimeOfDay() <= 10 && hero.getWill() >= 2)
        if (regionID === id && timeLeft) { // successful move
          console.log("You can move!")
          let targetRegion: Region = model.getRegions()[id];
          hero.moveTo(targetRegion)

          socket.broadcast.emit("updateMoveRequest", hero.getKind(), id)
          callback(hero.getKind(), id)
        }
      }
    }
  });

  socket.on("moveHeroTo", function (heroType, tile, callback) {
    console.log("yoink")
    callback(heroType, tile);
  })

  socket.on("endTurn", function() {
    var nextPlayer = model.nextPlayer(false)

    // Emitting with broadcast.to to the caller doesn't seem to work. Below is a workaround
    if (model.getCurrPlayersTurn() == nextPlayer) {
      console.log("Currplayer is only one left and keeps turn");
      socket.emit("yourTurn");
      return;
    }

    model.setCurrPlayersTurn(nextPlayer)
    console.log("Emitting yourTurn to ", nextPlayer)
    socket.broadcast.to(`/${model.getName()}#${nextPlayer}`).emit("yourTurn")
  })

  socket.on("pickupFarmer", function (callback) {
    var region:Region;
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    if (hero !== undefined) {
      region = hero.pickupFarmer();

      if (region !== undefined) {
        socket.broadcast.emit("destroyFarmer", region.getID());
        callback(region.getID());
      }
    }
  });

  socket.on("dropFarmer", function(callback){
    var result = new Array()
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    if (hero !== undefined) {
      result = hero.dropFarmer();

      //result[1] = dropped region id, result[0] = farmer id
      if (result !== undefined) {
        //Farmer dropped on reitburg
        if(result[1] === 0){
          model.getCastle().incShields();
          console.log(model.getCastle());
        }
        io.of("/"+model.getName()).emit("addFarmer", result[1], result[0])
        callback(result[1]);
      }
    }
  });

  socket.on("merchant", function (callback) {
    let success = false;
    var heroId = socket.conn.id;
    let hero = model.getHero(heroId);

    if (hero !== undefined) {
      success = hero.buyStrength();
    }

    if (success) {
      console.log(hero);
      callback();
    }
  });

  socket.on("getNumShields", function (callback) {
    let success = false;
    var numShields = model.getCastle().getShields();

    if(numShields !== undefined){
      console.log(numShields)
      callback(numShields)
    }
  });

  socket.on("useWell", function (callback) {
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    console.log("Hero requesting well use: ", hero.getKind());
    if (hero !== undefined) {
      let wpInc = hero.useWell();
      if (wpInc != -1) {
        // pass back the determined amount of wp to add to the hero
        console.log("Server: Well use success,", hero.getKind(), wpInc); //may need to convert to string
        // Update the hero that used the well
        callback(wpInc);
        // Update the other heroes
        socket.broadcast.emit("updateWell", hero.getRegion().getID(), wpInc);
      }
    }
  });

  socket.on("dropGold", function (callback) {
    console.log("here3") //printed
    let success_dropGold = false;
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    
    if (hero !== undefined) {
        success_dropGold = hero.dropGold();
    }
    if (success_dropGold) {
        console.log("dropped") //printed
        socket.broadcast.emit("updateDropGold");
        callback()
    }
  });   

  socket.on("pickupGold", function (id, callback) { 
    console.log("picking up gold on server") //is printed
    let success_pickupGold = false;
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    //id is type string. must convert to number
    id = +id
    //console.log(hero.getRegion().getID(), id) 

    if (hero !== undefined && hero.getRegion().getID() === id && hero.getRegion().getGold() > 0) {
        success_pickupGold = hero.pickupGold();
    }

    if (success_pickupGold) {
        console.log("pickupGold successful") //is printed
        socket.broadcast.emit("updatePickupGold");
        callback()
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
    if (hero !== undefined) {
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

  socket.on("getHeros", function (callback) {
    let heros = new Array<HeroKind>();
    model.getHeros().forEach((hero, key) => { heros.push(hero.hk) });
    if (heros.length !== 0)
      callback(heros);
  })


  socket.on("getHeroAttributes", function (type, callback) {
    let data = {};
    let hero: Hero;

    model.getHeros().forEach((hero, key) => {
      if (type === "Mage" && hero.hk === HeroKind.Mage) {
        hero = model.getHero(key);

        if (hero !== undefined) {
          data = hero.getData();
          callback(data)
        }
      } else if (type === "Archer" && hero.hk === HeroKind.Archer) {
        hero = model.getHero(key);

        if (hero !== undefined) {
          data = hero.getData();
          callback(data)
        }

      } else if (type === "Warrior" && hero.hk === HeroKind.Warrior) {
        hero = model.getHero(key);

        if (hero !== undefined) {
          data = hero.getData();
          callback(data)
        }

      } else if (type === "Dwarf" && hero.hk === HeroKind.Dwarf) {
        hero = model.getHero(key);

        if (hero !== undefined) {
          data = hero.getData();
          callback(data)
        }
      }
    });
  });

  /*
   * COLLAB DECISION
   */
  // Submitting a decision
  socket.on('collabDecisionSubmit', function(resAllocated, resNames, involvedHeroes) {
    if(model.getCurrPlayersTurn() == ""){
      model.setCurrPlayersTurn(socket.conn.id)
    }
    console.log(resAllocated);
    // Check that numAccepts equals total num of players-1
    if (model.numAccepts != involvedHeroes.length-1) {
      // Failure: need more accepts before valid submit
      socket.emit('sendDecisionSubmitFailure');
      return;
    }
    // Success: distribute accordingly
    let modelHeros = model.getHeros();
    for (let hero of modelHeros.values()) {
      let heroTypeString = hero.getKind().toString();
      // if the hero was involved in the collab decision, update their resources
      if (resAllocated[heroTypeString]) {
        let currHero = hero;
        // Iterate through resNames and map index to amount specified in resAllocated
        for (let i=0; i<resNames.length; i++) {
          if (resNames[i] == "gold") {
            currHero?.updateGold(resAllocated[heroTypeString][i]);
          } 
          else if (resNames[i] == "wineskin") {
            currHero?.setWineskin(resAllocated[heroTypeString][i]>0);
          }
          else if (resNames[i] == 'will') {
            currHero?.setWill(resAllocated[heroTypeString][i])
          }
        }
        // console.log("Updated", heroTypeString, "gold:", currHero?.getGold(), "wineskin:", currHero?.getWineskin())
      }
    }
    // Reset decision related state
    model.numAccepts = 0;

    socket.broadcast.emit('sendDecisionSubmitSuccess')
    socket.emit('sendDecisionSubmitSuccess')
  })

  // Accepting a decision
  socket.on('collabDecisionAccept', function () {
    model.numAccepts += 1;
    console.log('number of players accepted decision: ', model.numAccepts)
    // Tell the client that accepted to update their status
    socket.emit('sendDecisionAccepted', model.numAccepts)
  })

  /*
  * BATTLING
  */
  socket.on('getMonsterStats', function (monstername, callback) {
    try {
      let monster = model.getMonsters().get(monstername)
      callback({str:monster!.getStrength(), will:monster!.getWill(), reward:monster!.getGold(), type:monster!.getType()})
    }
    catch {
      console.log("invalid monster name!")
    }
  })

  socket.on('killMonster', function (monstername) {
    let monstertile = model.getMonsters().get(monstername)?.getTileID()
    let monsterregion = model.getRegions()[monstertile!]
    monsterregion.setMonster(null)
    console.log(model.getRegions()[monstertile!].getMonster(), 'should be null!')
    model.deleteMonster(monstername)
    // console.log(convMonsters);
    socket.broadcast.emit('sendKilledMonsters', monstername);
    //socket.emit('sendKilledMonsters', monstername);
  })

  socket.on('heroRoll', function(callback) {
    let heroId = socket.conn.id
    var hero = model.getHero(heroId)
    var roll = hero.roll()
    hero.incrementHour()
    callback(roll)
  })

  socket.on('confirmroll', function(herokind, roll, str) {
    socket.broadcast.emit('receiveAlliedRoll',herokind, roll, str)
  })

  socket.on('monsterRoll', function(m, callback) {
    var heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    let heroregion = hero.getRegion().getID()
    let monster = model.getMonsters().get(m)
    let monsterregion = monster!.getTileID()
    if (heroregion == monsterregion) {
      let monsterroll = monster!.rollDice()
      callback(monsterroll)
    }
    else if (hero.getKind() == HeroKind.Archer ){
      if (hero.getRegion().getAdjRegionsIds().includes(monsterregion) || heroregion == monsterregion) {
        let monsterroll = monster!.rollDice()
        callback(monsterroll)
      }
      else {
        callback('outofrange')
      }
      
    }
    else {
      callback('outofrange')
    }
  })

  socket.on('doDamageToMonster', function(themonster, dmg) {
    let monster = model.getMonsters().get(themonster)
    monster!.setWill(monster!.getWill() - dmg)
    //dont have to handle monster death here. a seperate message gets sent from fight window upon death.
  })

  socket.on('doDamageToHero', function(thehero, damage) {
    let modelHeros = model.getHeros();
    for (let hero of modelHeros.values()) {
      let heroTypeString = hero.getKind().toString();
      console.log(heroTypeString, 'herotypestring')
      console.log(thehero, 'thehero')
      if (heroTypeString == thehero) {
        hero.setWill(-damage)
        if (hero.getWill() < 1) {
          //hero death. remove them from all battles please.
          hero.setStrength(-1);
          hero.resetWill()
        }
      }
    }
  })

  socket.on('getHerosInRange', function(id, callback) {
    var centraltile = model.getRegions()[id]
    var centraltileid = centraltile.getID()
    var adjregionids = centraltile.getAdjRegionsIds()
    let dwarftile: number = -1 
    let archertile: number = -1 
    let magetile: number = -1  
    let warriortile: number = -1 

    model.getHeros().forEach((hero, key) => {
      if (hero.hk === HeroKind.Mage) {
        hero = model.getHero(key);
        if (hero !== undefined && hero.getTimeOfDay() < 10) {
          magetile = hero.getRegion().getID();
        }
      } 
      
      else if (hero.hk === HeroKind.Archer) {
        hero = model.getHero(key);
        if (hero !== undefined && hero.getTimeOfDay() < 10) {
          archertile = hero.getRegion().getID()
        }
      } 
      
      else if (hero.hk === HeroKind.Warrior) {
        hero = model.getHero(key);
        if (hero !== undefined && hero.getTimeOfDay() < 10) {
          warriortile = hero.getRegion().getID()
        }
      } 
      
      else if (hero.hk === HeroKind.Dwarf) {
        hero = model.getHero(key);
        if (hero !== undefined && hero.getTimeOfDay() < 10) {
          dwarftile = hero.getRegion().getID()
        }
      }
    });

    var heroeswithinrange : string[] = []
    if (centraltileid == dwarftile) {
      heroeswithinrange.push('dwarf')
    }
    if (adjregionids.includes(archertile) || centraltileid == archertile) {
      heroeswithinrange.push('archer')
    }
    if (centraltileid == magetile) {
      heroeswithinrange.push('mage')
    }
    if (centraltileid == warriortile) {
      heroeswithinrange.push('warrior')
    }
    callback(heroeswithinrange)
  })

  socket.on('sendBattleInvite', function(id, herosinrange) {
    var heroids = model.getIDsByHeroname(herosinrange)
    for (let playerid of heroids) {
      socket.broadcast.to(`/${model.getName()}#${playerid}`).emit("receiveBattleInvite")
    }
  })

  socket.on('sendBattleInviteResponse', function(response, herokind) {
    socket.broadcast.emit('recieveBattleInviteResponse', response, herokind)
  })

  socket.on('battleCollabApprove', function(windowname) {
    socket.broadcast.emit('battleRewardsPopup',windowname)
  })

  //TODO test this further
  socket.on('deathNotice', function(hero) {
    //could also just emit it to everyone....
    var deadheroid = model.getIDsByHeroname([hero]) 
    for (let playerid of deadheroid) {
      socket.broadcast.to(`/${model.getName()}#${playerid}`).emit("receiveDeathNotice")
    }
  })


  /*
  * END DAY
  */
  socket.on('endDay', function(callback) {
    // Reset this hero's hours and tell all clients to update their hourtracker
    var resetHoursHk = model.resetHeroHours(socket.conn.id);
    console.log("tell client to reset hour tracker for", resetHoursHk)
    socket.emit("sendResetHours", resetHoursHk);
    socket.broadcast.emit("sendResetHours", resetHoursHk);

    // Hero gets first turn of next day if they were first to end the current day
    if (model.getActiveHeros().length == model.getHeros().size) {
      model.setNextDayFirstHero(socket.conn.id);
    }

    // If they were the last hero to end the day, trigger all actions and pass turn to
    // the hero who ended the day first
    var nextPlayer;
    if (model.getActiveHeros().length == 1) {
      // Turn goes to the hero that first ended their day
      nextPlayer = model.nextPlayer(true)

      model.resetActiveHeros();
      // Tell all clients to move monsters and refresh wells
      callback(true);
    } else {
      // If not the last hero, then don't trigger end of day actions and pass turn to the
      // next hero by rank as normal
      nextPlayer = model.nextPlayer(false);

      // Remove hero from active heroes
      model.removeFromActiveHeros(socket.conn.id);
      callback(false);
    }

    // Note: In actual gameplay, a call to endDay will never pass the turn back to the same player.
    // However, for testing purposes it is useful to run the game with only one player. Below code
    // is a workaround for emitting yourTurn back to the caller without using broadcast.to
    if (model.getCurrPlayersTurn() == nextPlayer) {
      console.log("Currplayer is only one left and keeps turn");
      socket.emit("yourTurn");
      return;
    }

    // Inform client that gets the next turn
    model.setCurrPlayersTurn(nextPlayer)
    console.log("Emitting yourTurn to ", nextPlayer)
    socket.broadcast.to(`/${model.getName()}#${nextPlayer}`).emit("yourTurn")
  })

  socket.on('moveMonstersEndDay', function () {
    model.moveMonsters();
    // Convert monsters Map into passable object
    let convMonsters = {};
    for (let m of Array.from(model.getMonsters().values())) {
      convMonsters[m.name] = m.getTileID();
    }
    socket.broadcast.emit('sendUpdatedMonsters', convMonsters);
    socket.emit('sendUpdatedMonsters', convMonsters);
  })

  socket.on("resetWells", function (callback) {
    var replenished = model.replenishWells();
    callback(replenished);
    socket.broadcast.emit("fillWells", replenished);
  })

  /**
   * Returns all fog after initializing on the server side
   */
  socket.on("getFog", function(callback){
    var fog = model.getFogs();
    callback(Array.from(fog))
  })

  function getCurrentDate() {
    var currentDate = new Date();
    var hour = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
    var minute = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
    var second = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();

    return hour + ":" + minute + ":" + second;
  }
}

