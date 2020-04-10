import { Game, HeroKind, Region, Hero, Monster, Fog, MonsterKind } from '../model';
import { SmallItem } from '../model/SmallItem';
import { LargeItem } from '../model/LargeItem';

import { mapToJson } from "../utils/helpers";

export function game(socket, model: Game, io) {

  socket.on("save", function () {
    var fs = require('fs');
    let tempData = fs.readFileSync('db.json')
    let data = JSON.parse(tempData);

    const gameName = model.getName();
    const game = {};
    game['name'] = gameName;
    game['difficulty'] = model.difficulty;
    game['numOfDesiredPlayers'] = model.numOfDesiredPlayers;
    game['castle'] = JSON.stringify(model.getCastle());
    game['fogs'] = mapToJson(model.getFogs());
    game['heros'] = JSON.stringify(Array.from(model.getHeros().values()));
    game['farmers'] = JSON.stringify(model.getFarmers());
    game['monsters'] = JSON.stringify(Array.from(model.getMonsters().values()));
    game['monstersInCastle'] = JSON.stringify(model.getMonstersInCastle());
    game['endOfGame'] = model.getEndOfGameState();
    game['eventDeck'] = JSON.stringify(model.getEventDeck());
    game['activeEvents'] = JSON.stringify(model.getActiveEvents());
    game['nextDayFirstHero'] = model.nextDayFirstHero;
    game['currPlayersTurn'] = model.currPlayersTurn;
    game['activeHeros'] = JSON.stringify(model.getActiveHeros());
    game['regions'] = JSON.stringify(model.getRegions());
    game['prince'] = JSON.stringify(model.getPrince());
    game['narrator'] = JSON.stringify(model.getNarrator(),["legendPosition"])

    if (!data.games) {
      data['games'] = {}
    }
    data['games'][gameName] = game;
    // console.log(data);
    fs.writeFileSync("db.json", JSON.stringify(data, null, 1));
  })

  socket.on("getGameData", function (callback) {
    // im sorry for whoever will have to read this. We're too tight on time.
    const maps = ["monsters", "players", "heroList", "fogs"]
    let tempModel = {};
    Object.keys(model).forEach((key) => {
      if (maps.includes(key)) { // convert maps to arrays so that socket can pass them.
        tempModel[key] = Array.from(model[key]);
      } else
        tempModel[key] = model[key];
    });
    // acui: I'm sorry for this hack, used to get the order of heroes entering the game
    tempModel["startGamePos"] = model.gameStartHeroPosition;
    model.gameStartHeroPosition += 1;
    callback(tempModel)
  })

  socket.on("moveRequest", function (id, callback) {
    id = +id // turning Id from string to number
    var heroID = socket.conn.id
    let hero = model.getHero(heroID);

    if (hero !== undefined) {
      var currRegion: Region = hero.getRegion()
      var adjRegions: Array<number> = currRegion.getAdjRegionsIds()
      var event19 = model.getActiveEvents().includes(19)
      var event26 = model.getActiveEvents().includes(26)
      
      for (var regionID of adjRegions) {
        var timeLeft = hero.getTimeOfDay() <= 7 || (hero.getTimeOfDay() <= 10 && hero.getWill() >= 2 && !event19) || hero.getTimeOfDay() == 8 && event26
        || hero.getTimeOfDay() <= 10 && hero.getWill() >=3 && event19
        if (regionID === id && timeLeft) { // successful move
          let targetRegion: Region = model.getRegions()[id];

          //if event 26 is active and it is your 8th hour, move freely
          if(hero.getTimeOfDay() == 8 && event26){
            hero.freeMoveTo(targetRegion)
          }
          else if((hero.getTimeOfDay() == 9 || hero.getTimeOfDay() == 10) && event19){
            hero.exhaustingMoveTo(targetRegion)
          }
          else{
            hero.moveTo(targetRegion)
          }
          socket.broadcast.emit("updateMoveRequest", hero.getKind(), id)
          callback(hero.getKind(), id)
        }
      }
    }
  });

  socket.on("movePrinceRequest", function (id, callback) {
    id = +id // turning Id from string to number
    var heroID = socket.conn.id
    let hero = model.getHero(heroID);

    console.log(hero.getNumPrinceMoves());

    if (hero !== undefined) {
      if (model.getPrince() == null) return;
      var currPrinceRegion: Region = model.getPrince()!.getRegion();
      var adjPrinceRegions: Array<number> = currPrinceRegion.getAdjRegionsIds()
      
      for (var regionID of adjPrinceRegions) {
        var timeLeft = hero.getTimeOfDay() <= 7 || (hero.getTimeOfDay() <= 10 && hero.getWill() >= 2)
        if (regionID === id && timeLeft) { // successful move
          let targetRegion: Region = model.getRegions()[id];

          model.getPrince()!.moveTo(targetRegion);
          hero.movePrince();

          socket.broadcast.emit("updateMovePrinceRequest", hero.getKind(), id, hero.getNumPrinceMoves())
          callback(hero.getKind(), id, hero.getNumPrinceMoves())
        }
      }
    }
  });

  socket.on("moveHeroTo", function (heroType, tile, callback) {
    callback(heroType, tile);
  })

  socket.on("endTurn", function () {
    var nextPlayer = model.nextPlayer(false)

    var heroID = socket.conn.id
    let hero = model.getHero(heroID);

    hero.resetPrinceMoves();

    // Emitting with broadcast.to to the caller doesn't seem to work. Below is a workaround
    if (model.getCurrPlayersTurn() == nextPlayer) {
      socket.emit("yourTurn");
      return;
    }

    model.setCurrPlayersTurn(nextPlayer)
    // get the connID corresponding to the HK
    var nextPlayerID = model.getConnIdFromHk(nextPlayer);
    console.log("Sending next turn to ", nextPlayer, "with ID", nextPlayerID);
    socket.broadcast.to(`/${model.getName()}#${nextPlayerID}`).emit("yourTurn");
  })

  socket.on("pickupFarmer", function (tileID: number, callback) {
    var region: Region;
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    if (hero !== undefined) {
      // if the hero's tile is not the same as the farmer's tile, return
      if (hero.getRegion().getID() != tileID) return;
      region = hero.pickupFarmer();
      console.log("pickup farmer", region)

      if (region !== undefined) {
        socket.broadcast.emit("destroyFarmer", region.getID());
        callback(region.getID());
      }
    }
  });

  socket.on("dropFarmer", function (callback) {
    var result = new Array()
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    if (hero !== undefined) {
      result = hero.dropFarmer();

      //result[1] = dropped region id, result[0] = farmer id
      // If drop unsuccessful, it will be an empty array
      if (result.length == 2) {
        //Farmer dropped on reitburg
        if (result[1] === 0) {
          model.getCastle().incShields();
        }
        io.of("/" + model.getName()).emit("addFarmer", result[1], result[0])
        callback(result[1]);
      }
    }
  });


  /*
  * NARRATOR RELATED
  */
  socket.on("getNarratorPosition", function(callback) {
    callback(model.getNarrator().getLegendPosition());
  })

  socket.on("placeRuneStoneLegend", function() {
    let runestonePos = model.getNarrator().setRunestoneLegendPos();
    let narratorPos = model.getNarrator().advance();

    socket.emit("updateNarrator", narratorPos, runestonePos)
    socket.broadcast.emit("updateNarrator", narratorPos, runestonePos)
  })

  // TODO: FOR TESTING ONLY, REMOVE AFTER
  socket.on("advanceNarrator", function() {
    advanceNarrator();
  })

  function advanceNarrator() {
    // Updates the backend model based on new narrator pos and emits to all clients
    var newMonsters = model.advanceNarrator();
    var narratorPos = model.getNarrator().getLegendPosition();
    console.log("backend advanceNarrator", narratorPos, newMonsters)

    // Emit new monsters back to clients if needed
    let runestoneLegendPos = model.getNarrator().getRunestoneLegendPos();
    if (narratorPos==runestoneLegendPos || narratorPos==2 || narratorPos==6) {
      for (let m of newMonsters) {
        socket.emit("addMonster", m.getType(), m.getTileID(), m.getName());
        socket.broadcast.emit("addMonster", m.getType(), m.getTileID(), m.getName());
      }
    }
    // Update shields
    var shieldsRemaining = model.getCastle().getShields();
    socket.broadcast.emit('updateShields', shieldsRemaining);
    socket.emit('updateShields', shieldsRemaining);

    // Pass back the runestone locations for the runestone narrator event, don't otherwise
    if (narratorPos == runestoneLegendPos) {
      let runestoneLocs = model.getNarrator().getRunestoneLocations();
      socket.emit("updateNarrator", narratorPos, -1, runestoneLocs)
      socket.broadcast.emit("updateNarrator", narratorPos, -1, runestoneLocs)
    } else {
      socket.emit("updateNarrator", narratorPos)
      socket.broadcast.emit("updateNarrator", narratorPos)  
    }
  }
  //////////////////////////////////////////////////


  socket.on("merchant", function (callback) {
    let success = false;
    var heroId = socket.conn.id;
    let hero = model.getHero(heroId);

    if (hero !== undefined) {
      success = hero.buyStrength();
    }

    if (success) {
      callback();
    }
  });

  socket.on("getNumShields", function (callback) {
    var numShields = model.getCastle().getShields();

    if (numShields !== undefined) {
      callback(numShields)
    }
  });

  socket.on("useWell", function (callback) {
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    if (hero !== undefined) {
      let wpInc = hero.useWell();
      if (wpInc != -1) {
        // pass back the determined amount of wp to add to the hero
        console.log("Server: Well use success,", hero.getKind(), wpInc); //may need to convert to string
        // Update the hero that used the well
        callback(wpInc);
        // Update the other heroes
        socket.broadcast.emit("updateWell", hero.getRegion().getID(), wpInc);
        // TODO WELL: update hero windows
      }
    }
  });

  // TODO: this will require a refactor to work with monster hopping
  socket.on("useFog", function (fogType, tile, callback) {
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    if (hero != undefined && tile == hero.getRegion().getID()) {
      // useFog needs to return the actual tile the monster ends up on, can't assume that it is
      // the same as the fog tile it spawned from.
      let { success, id, event, newTile, createSuccess } = model.useFog(fogType, +tile);
      if (success) {
        if (fogType === Fog.Gor && createSuccess) {
          io.of("/" + model.getName()).emit("addMonster", MonsterKind.Gor, newTile, id);
        }
        if(fogType === Fog.EventCard){
          if(event != null){
            //will have to add blockable events once shields are implemented
            io.of("/" + model.getName()).emit("newEvent", event);
            //these will be blockable
            if(event.id ==  2 || event.id ==  5 || event.id == 11 || event.id == 15 || event.id == 17 || 
               event.id == 19 || event.id == 22 || event.id == 24 || event.id == 31 || event.id == 32){
              //trigger collab decision between players. 
              //blocked = collabCall
              //if !blocked
              model.applyEvent(event)
            }
            else{
              model.applyEvent(event)
            }
          }
        }

        callback(tile);
        socket.broadcast.emit("destroyFog", tile);
      }

      // Update shields
      var shieldsRemaining = model.getCastle().getShields();
      socket.broadcast.emit('updateShields', shieldsRemaining);
      socket.emit('updateShields', shieldsRemaining);

    }
  });

  // Send amount of gold on tileID back to client
  socket.on("getTileGold", function (tileID, callback) {
    var goldAmount = model.getRegions()[tileID].getGold();
    callback(goldAmount);
  });

  socket.on("dropGold", function () {
    let success_dropGold = false;
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);

    if (hero !== undefined) {
      success_dropGold = hero.dropGold();
    }
    if (success_dropGold) {
      // Tell any active TileWindows of all clients to update
      socket.broadcast.emit("updateDropGoldTile", hero.getRegion().getID(), hero.getRegion().getGold());
      socket.emit("updateDropGoldTile", hero.getRegion().getID(), hero.getRegion().getGold());
      // Tell any active HeroWindows of all clients to update
      socket.broadcast.emit("updateDropGold", hero.getKind(), -1);
      socket.emit("updateDropGold", hero.getKind(), -1);
    }
  });

  socket.on("pickupGold", function (id) {
    let success_pickupGold = false;
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    //id is type string. must convert to number
    id = +id

    if (hero !== undefined && hero.getRegion().getID() === id && hero.getRegion().getGold() > 0) {
      // TODO_PICKUP: validation could be moved into this pickupGold method instead
      success_pickupGold = hero.pickupGold();
    }

    if (success_pickupGold) {
      // Tell any active TileWindows of all clients to update
      socket.broadcast.emit("updatePickupGoldTile", id, hero.getRegion().getGold());
      socket.emit("updatePickupGoldTile", id, hero.getRegion().getGold());
      // Tell any active HeroWindows of all clients to update
      socket.broadcast.emit("updatePickupGold", hero.getKind(), 1);
      socket.emit("updatePickupGold", hero.getKind(), 1);
    }
  });

  /*
  *   DROP AND PICKUP ITEMS
  */

  // Send items and quantities of tileID back to client
  socket.on("getTileItems", function (tileID, callback) {
    var tileItems = model.getRegions()[tileID].getItems();
    callback(tileItems);
  });

  socket.on("pickupItem", function (tileID, itemName: string, itemType: string) {
    let successStatus = false;
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);

    if (hero !== undefined) {
      switch (itemType) {
        case "largeItem":
          successStatus = hero.pickUpLargeItem(tileID, largeItemStrToEnum(itemName));
          break;
        case "helm":
          successStatus = hero.pickUpHelm(tileID);
          break;
        case "smallItem":
          successStatus = hero.pickUpSmallItem(tileID, smallItemStrToEnum(itemName));
          break;
      }
    }
    if (successStatus) {
      // Tell any active TileWindows of all clients to update
      socket.broadcast.emit("updatePickupItemTile", hero.getRegion().getID(), itemName, itemType);
      socket.emit("updatePickupItemTile", hero.getRegion().getID(), itemName, itemType);
      // Tell any active HeroWindows of all clients to update
      socket.broadcast.emit("updatePickupItemHero", hero.getKind(), itemName, itemType);
      socket.emit("updatePickupItemHero", hero.getKind(), itemName, itemType);
    }
  })

  socket.on("dropItem", function(itemName: string, itemType: string) {
    let successStatus = false;
    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    let name = itemName;

    if (hero !== undefined) {
      switch (itemType) {
        case "largeItem":
          name = hero.getLargeItem();
          successStatus = hero.dropLargeItem();
          break;
        case "helm":
          name = "helm";
          successStatus = hero.dropHelm();
          break;
        case "smallItem":
          // There doesn't seem to be a good way of converting string to corresponding enum
          const smallItem: SmallItem = smallItemStrToEnum(itemName);
          // console.log("server attempt to drop", smallItem)
          successStatus = hero.dropSmallItem(smallItem);
          break;
      }
    }
    // console.log("successStatus:", successStatus)
    if (successStatus) {
      // Tell any active TileWindows of all clients to update
      socket.broadcast.emit("updateDropItemTile", hero.getRegion().getID(), name, itemType);
      socket.emit("updateDropItemTile", hero.getRegion().getID(), name, itemType);
      // Tell any active HeroWindows of all clients to update
      socket.broadcast.emit("updateDropItemHero", hero.getKind(), name, itemType);
      socket.emit("updateDropItemHero", hero.getKind(), name, itemType);
    }
  })

  /////////////////////////////

  socket.on('bind hero', function (heroType, callback) {
    let id = socket.conn.id;
    const success = model.getHeros().size < model.numOfDesiredPlayers && model.bindHero(id, heroType);
    if (success) {
      model.readyplayers += 1;
      let remaining = model.getAvailableHeros();
      let heros = {
        taken: ["archer", "warrior", "mage", "dwarf"].filter(f => !remaining.toString().includes(f)),
        remaining: remaining
      }
      socket.broadcast.emit("updateHeroList", heros)
      callback(heros);
    }
  });

  socket.on("getBoundHeros", (callback) => {
    let remaining = model.getAvailableHeros();
    let heros = {
      taken: ["archer", "warrior", "mage", "dwarf"].filter(f => !remaining.toString().includes(f)),
      remaining: remaining
    }
    callback(heros);
  });

  socket.on('getAdjacentTiles', function (centraltileid, callback) {
    var region = model.getRegions()[centraltileid]
    var adjacentregions = region.getAdjRegionsIds()
    callback(adjacentregions)
  })

  socket.on('disconnect', function () {
    console.log('user disconnected', socket.conn.id, ' in game.');
    // model.removePlayer(socket.conn.id);
  });

  socket.on("send message", function (sent_msg, callback) {
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
    socket.broadcast.emit('removeObjListener', object)
  })

  socket.on('allPlayersReady', function (callback) {
    callback(model.readyplayers === model.getNumOfDesiredPlayers());
  })

  socket.on("getHeros", function (callback) {
    let heros = new Array<HeroKind>();
    model.getHeros().forEach((hero, key) => { heros.push(hero.hk) });
    if (heros.length !== 0)
      callback(heros);
  })

  socket.on("getHeroAttributes", function (type, callback) {
    let data = {};

    model.getHeros().forEach((hero, key) => {
      if (type === "mage" && hero.hk === HeroKind.Mage) {
        hero = model.getHero(key);

        if (hero !== undefined) {
          data = hero.getData();
          callback(data)
        }
      } else if (type === "archer" && hero.hk === HeroKind.Archer) {
        hero = model.getHero(key);

        if (hero !== undefined) {
          data = hero.getData();
          callback(data)
        }

      } else if (type === "warrior" && hero.hk === HeroKind.Warrior) {
        hero = model.getHero(key);

        if (hero !== undefined) {
          data = hero.getData();
          callback(data)
        }

      } else if (type === "dwarf" && hero.hk === HeroKind.Dwarf) {
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
  socket.on('collabDecisionSubmit', function (resAllocated, resNames, involvedHeroes) {
    // Sets the first player at the beginning of the game
    if (model.getCurrPlayersTurn() == HeroKind.None) {
      model.setCurrPlayersTurn(model.getHkFromConnID(socket.conn.id));
    }
    // Check that numAccepts equals total num of players-1
    if (model.numAccepts != involvedHeroes.length - 1) {
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
        for (let i = 0; i < resNames.length; i++) {
          if (resNames[i] == "gold") {
            currHero.updateGold(resAllocated[heroTypeString][i]);
          }
          else if (resNames[i] == "wineskin") {
            // TODO: actually give the hero the wineskin (use smallItems API)
            currHero?.setWineskin(resAllocated[heroTypeString][i] > 0);
            for (let j = 0; j < resAllocated[heroTypeString][i]; j++) {
              currHero.pickUpSmallItem(currHero.getRegion().getID(), SmallItem.Wineskin);
            }
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
    // Tell the client that accepted to update their status
    socket.emit('sendDecisionAccepted', model.numAccepts)
  })

  /*
  * BATTLING
  */
  socket.on('getMonsterStats', function (monstername, callback) {
    try {
      let monster = model.getMonsters().get(monstername)
      callback({ str: monster!.getStrength(), will: monster!.getWill(), reward: monster!.getGold(), type: monster!.getType() })
    }
    catch {
      console.log("invalid monster name!")
    }
  })

  socket.on('killMonster', function (monstername) {
    let monstertile = model.getMonsters().get(monstername)?.getTileID()
    let monsterregion = model.getRegions()[monstertile!]
    monsterregion.setMonster(null)
    model.deleteMonster(monstername)
    // console.log(convMonsters);
    socket.broadcast.emit('sendKilledMonsters', monstername);
    //socket.emit('sendKilledMonsters', monstername);
    advanceNarrator();
  })

  socket.on('heroRoll', function (bow, callback) {
    let heroId = socket.conn.id
    var hero = model.getHero(heroId)
    var roll = hero.roll(bow)
    hero.incrementHour()
    callback(roll)
  })

  socket.on('confirmroll', function (herokind, roll, str) {
    socket.broadcast.emit('receiveAlliedRoll', herokind, roll, str)
  })

  socket.on('monsterRoll', function (m, callback) {
    //the boolean parameter in the callback is to determine if the bow special ability will be used for the hero roll.
    var heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    let heroregion = hero.getRegion().getID()
    let monster = model.getMonsters().get(m)
    let monsterregion = monster!.getTileID()
    //if hero is on same tile as monster.
    if (heroregion == monsterregion) {
      let monsterroll = monster!.rollDice()
      callback(monsterroll, false)
    }
    //if hero is adjacent, but has a bow, and is not archer
    else if (hero.getKind() != HeroKind.Archer && (hero.getRegion().getAdjRegionsIds().includes(monsterregion)) && hero.getLargeItem() == 'bow') {
      let monsterroll = monster!.rollDice()
      console.log('here!')
      callback(monsterroll, true)
    }
    //if hero is archer
    else if (hero.getKind() == HeroKind.Archer) {
      if (hero.getRegion().getAdjRegionsIds().includes(monsterregion) || heroregion == monsterregion) {
        let monsterroll = monster!.rollDice()
        callback(monsterroll, false)
      }
      else {
        callback('outofrange', false)
      }

    }
    //otherwise hero is not in range.
    else {
      callback('outofrange', false)
    }
  })

  socket.on('doDamageToMonster', function (themonster, dmg) {
    let monster = model.getMonsters().get(themonster)
    monster!.setWill(monster!.getWill() - dmg)
    //dont have to handle monster death here. a seperate message gets sent from fight window upon death.
  })

  socket.on('resetMonsterStats', function(name) {
    let monster = model.getMonsters().get(name)
    monster?.resetWill()
  })

  socket.on('doDamageToHero', function (thehero, damage) {
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

  socket.on('updateHeroTracker', function(hero) {
    socket.broadcast.emit('receiveUpdateHeroTracker',hero)
  })

  socket.on('getHerosInRange', function (id, callback) {
    var centraltile = model.getRegions()[id]
    var centraltileid = centraltile.getID()
    var adjregionids = centraltile.getAdjRegionsIds()
    let dwarftile: number = -1
    var dwarfbow = false
    let archertile: number = -1
    let magetile: number = -1
    var magebow = false
    let warriortile: number = -1
    var warriorbow = false

    model.getHeros().forEach((hero, key) => {
      if (hero.hk === HeroKind.Mage) {
        hero = model.getHero(key);
        if (hero !== undefined && hero.getTimeOfDay() < 10) {
          magetile = hero.getRegion().getID();
          if (hero.getLargeItem() == 'bow') {
            magebow = true
          }
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
          if (hero.getLargeItem() == 'bow') {
            warriorbow = true
          }
        }
      }

      else if (hero.hk === HeroKind.Dwarf) {
        hero = model.getHero(key);
        if (hero !== undefined && hero.getTimeOfDay() < 10) {
          dwarftile = hero.getRegion().getID()
          if (hero.getLargeItem() == 'bow') {
            dwarfbow = true
          }
        }
      }
    });

    var heroeswithinrange: string[] = []
    if (centraltileid == dwarftile || (adjregionids.includes(dwarftile) && dwarfbow)) {
      heroeswithinrange.push('dwarf')
    }
    if (adjregionids.includes(archertile) || centraltileid == archertile) {
      heroeswithinrange.push('archer')
    }
    if (centraltileid == magetile || (adjregionids.includes(magetile) && magebow)) {
      heroeswithinrange.push('mage')
    }
    if (centraltileid == warriortile || (adjregionids.includes(warriortile) && warriorbow)) {
      heroeswithinrange.push('warrior')
    }
    callback(heroeswithinrange)
  })

  socket.on('sendBattleInvite', function (id, herosinrange) {
    var heroids = model.getIDsByHeroname(herosinrange)
    for (let playerid of heroids) {
      socket.broadcast.to(`/${model.getName()}#${playerid}`).emit("receiveBattleInvite", id)
    }
  })

  socket.on('sendBattleInviteResponse', function (response, herokind) {
    socket.broadcast.emit('recieveBattleInviteResponse', response, herokind)
  })

  socket.on('battleCollabApprove', function (windowname) {
    socket.broadcast.emit('battleRewardsPopup', windowname)
  })

  //TODO test this further
  socket.on('deathNotice', function (hero) {
    //could also just emit it to everyone....
    var deadheroid = model.getIDsByHeroname([hero])
    for (let playerid of deadheroid) {
      socket.broadcast.to(`/${model.getName()}#${playerid}`).emit("receiveDeathNotice")
    }
  })


  /*
  * END DAY
  */
  socket.on('endDay', function (callback) {
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
    var nextPlayer: HeroKind;
    if (model.getActiveHeros().length == 1) {
      //remove active Events
      model.clearActiveEvents()

      //draw and apply new event
      let event = model.drawCard()
      if(event != null){
        io.of("/" + model.getName()).emit("newEvent", event);
            //these will be blockable
            if(event.id ==  2 || event.id ==  5 || event.id == 11 || event.id == 15 || event.id == 17 || 
               event.id == 19 || event.id == 22 || event.id == 24 || event.id == 31 || event.id == 32){
              //trigger collab decision between players. 
              //blocked = collabCall
              //if !blocked
              model.applyEvent(event)
            }
            else{
              model.applyEvent(event)
            }
      }
      // Turn goes to the hero that first ended their day
      nextPlayer = model.nextPlayer(true)

      model.resetActiveHeros();
      // Tell all clients to move monsters and refresh wells
      callback(true);

      // TODO NARRATOR: this should probably trigger after the post-fight collab is completed instead
      advanceNarrator();
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
    model.setCurrPlayersTurn(nextPlayer);
    console.log("Emitting yourTurn to ", nextPlayer, "with id", model.getConnIdFromHk(nextPlayer));
    socket.broadcast.to(`/${model.getName()}#${model.getConnIdFromHk(nextPlayer)}`).emit("yourTurn");
  })

  socket.on('moveMonstersEndDay', function () {
    var shieldsRemaining = model.moveMonsters();
    // Convert monsters Map into passable object
    let convMonsters = {};
    for (let m of Array.from(model.getMonsters().values())) {
      convMonsters[m.name] = m.getTileID();
    }
    socket.broadcast.emit('sendUpdatedMonsters', convMonsters);
    socket.emit('sendUpdatedMonsters', convMonsters);

    socket.broadcast.emit('updateShields', shieldsRemaining);
    socket.emit('updateShields', shieldsRemaining);

    // Evaluate end of game state - currently only handles end of game due to loss of shields
    if (model.getEndOfGameState()) {
      socket.emit('endGame');
      socket.broadcast.emit('endGame');
    }
  })

  socket.on("resetWells", function (callback) {
    var replenished = model.replenishWells();
    callback(replenished);
    socket.broadcast.emit("fillWells", replenished);
  })

  /**
   * Returns all fog after initializing on the server side
   */
  socket.on("getFog", function (callback) {
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

  /////////////////////////
  // ITEM STUFF
  ////////////////////////

  socket.on('getHeroItems', function (herokind, callback) {
    var thehero: Hero
    model.getHeros().forEach((hero, key) => {
      console.log(hero.getKind())
      if (hero.getKind() == herokind) {
        thehero = hero
      }
    })
    var heroItemDict = thehero!.getItemDict()
    callback(heroItemDict)
  })

  socket.on('consumeItem', function (item) {
    var heroID = socket.conn.id
    let hero = model.getHero(heroID);
    hero.consumeItem(item)
  })

  socket.on('useWineskin', function (halforfull, callback) {
    var heroID = socket.conn.id
    let hero = model.getHero(heroID);
    if (halforfull == 'full') {
      hero.consumeItem('wineskin')
    }
    else {
      hero.consumeItem('half_wineskin')
    }
    callback()
    // update other client hero windows
    socket.broadcast.emit('receiveUseWineskin', hero.getKind(), halforfull);
  })

  ///////////////////////

  //////////////////////
  // TRADE STUFF
  /////////////////////

  socket.on('sendTradeInvite', function (host, invitee) {
    var invitee_id = model.getIDsByHeroname([invitee])
    for (let playerid of invitee_id) {
      socket.broadcast.to(`/${model.getName()}#${playerid}`).emit("receiveTradeInvite", host, invitee)
    }
  })

  socket.on('sendTradeOfferChanged', function (otherplayer, itemindex) {
    var otherplayer_id = model.getIDsByHeroname([otherplayer])
    for (let playerid of otherplayer_id) {
      socket.broadcast.to(`/${model.getName()}#${playerid}`).emit("receiveTradeOfferChanged", itemindex)
    }
  })


  socket.on('submitOffer', function (youroffer) {
    console.log(youroffer)
    socket.broadcast.emit('receiveOffer', youroffer)
  })

  socket.on('executeTrade', function (herokind, items_given, items_gained) {
    var thehero: Hero

    //deleting given items
    console.log('xxxxxxxxxxxxx')
    console.log(Object.values(SmallItem))
    console.log(herokind, items_given, items_gained)
    console.log('xxxxxxxxxxxxx')
    model.getHeros().forEach((hero, key) => {
      if (hero.getKind() == herokind) {
        thehero = hero
      }
    })


    for (let smallitem of items_given['smallItems']) {
      thehero!.deleteSmallItem(smallItemStrToEnum(smallitem))
    }
    if (items_given['largeItem'] != 'None') {
      thehero!.deleteLargeItem()
    }
    if (items_given['helm'] != 'None') {
      thehero!.deleteHelm()
    }
    thehero!.updateGold(-items_given['gold'])



    //adding received items
    for (let smallitem of items_gained['smallItems']) {
      thehero!.pickUpSmallItem(thehero!.getRegion().getID(), smallItemStrToEnum(smallitem))
    }
    thehero!.pickUpLargeItem(thehero!.getRegion().getID(), largeItemStrToEnum(items_gained['largeItem']))
    if (items_gained['helm'] != 'None') {
      thehero!.pickUpHelm(thehero!.getRegion().getID())
    }
    thehero!.updateGold(+items_gained['gold'])

  })

  function smallItemStrToEnum(str) : SmallItem {
    // console.log(str,'in converter')
    switch(str){
      case "wineskin" : return SmallItem.Wineskin
      case "half_wineskin": return SmallItem.HalfWineskin
      case "telescope": return SmallItem.Telescope
      case "brew": return SmallItem.Brew
      case "half_brew": return SmallItem.HalfBrew
      case "herb": return SmallItem.Herb
      case "blue_runestone": return SmallItem.BlueRunestone
      case "yellow_runestone": return SmallItem.YellowRunestone
      case "green_runestone": return SmallItem.GreenRunestone
      default: throw Error("String does not correspond to a SmallItem");
    }
  }

  function largeItemStrToEnum(str) : LargeItem {
    // console.log(str,'in converter')
    switch(str){
      case "falcon": return LargeItem.Falcon
      case "shield": return LargeItem.Shield
      case "bow": return LargeItem.Bow
      case "None": return LargeItem.Empty
      default: throw Error("String does not correspond to a LargeItem");
    }
  }

  socket.on('tradeDone', function () {
    socket.broadcast.emit('endTrade')
  })

  socket.on('validateTrade', function (hero1, hero2, hero1receives, hero2receives, callback) {
    var hero1ref: Hero
    var hero2ref: Hero
    model.getHeros().forEach((hero, key) => {
      if (hero.getKind() == hero1) {
        hero1ref = hero
      }
      if (hero.getKind() == hero2) {
        hero2ref = hero
      }
    })

    if (hero1receives['helm'] != 'None' && hero2receives['helm'] == 'None' && hero1ref!.getItemDict['helm'] != 'false') {
      console.log('xxxxxxxxxxxxxxxxxxxxxx1')
      callback('fail')
    }
    if (hero2receives['helm'] != 'None' && hero1receives['helm'] == 'None' && hero2ref!.getItemDict['helm'] != 'false') {
      console.log('xxxxxxxxxxxxxxxxxxxxxx2')
      callback('fail')
    }

    if (hero1receives['largeItem'] != 'None' && hero2receives['largeItem'] == 'None' && hero1ref!.getItemDict['largeItem'] != 'empty') {
      console.log('xxxxxxxxxxxxxxxxxxxxxx3')
      callback('fail')
    }
    if (hero2receives['helm'] != 'None' && hero1receives['helm'] == 'None' && hero2ref!.getItemDict['helm'] != 'empty') {
      console.log('xxxxxxxxxxxxxxxxxxxxxx4')
      callback('fail')
    }

    if (hero1receives['smallItems'].length + hero1ref!.getItemDict()['smallItems'].length - hero2receives['smallItems'].length > 3) {
      console.log('xxxxxxxxxxxxxxxxxxxxxx5')
      callback('fail')
    }

    if (hero2receives['smallItems'].length + hero2ref!.getItemDict()['smallItems'].length - hero1receives['smallItems'].length > 3) {
      console.log('xxxxxxxxxxxxxxxxxxxxxx6')
      callback('fail')
    }

    callback('pass')

  })
}

