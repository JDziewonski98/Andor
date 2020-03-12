import { Game, HeroKind, Region, Hero, Monster } from '../model';
import { callbackify } from 'util';

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

      if (result !== undefined) {
        console.log(hero)
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



  socket.on("useWell", function (callback) {
    let success_well = false;

    let heroId = socket.conn.id;
    let hero = model.getHero(heroId);
    if (hero !== undefined) {
      success_well = hero.useWell();

    }

    if (success_well) {
      socket.broadcast.emit("updateWell");
      callback();

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

 /* socket.on("dropGold", function (callback) {
    // TODO:
    callback()
  })*/

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

  // Collaborative decision making

  // Submitting a decision
  socket.on('collabDecisionSubmit', function(resAllocated, resNames) {
    console.log(resAllocated);
    // Check that numAccepts equals total num of players-1
    if (model.numAccepts != model.getNumOfDesiredPlayers() - 1) {
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

  socket.on('getMonsterStats', function (monstername, callback) {
    try {
      let monster = model.getMonsters().get(monstername)
      callback({str:monster!.getStrength(), will:monster!.getWill(), reward:monster!.getGold(), type:monster!.getType()})
    }
    catch {
      console.log("invalid monster name!")
    }
  })

  socket.on('monsterRoll', function (m, callback) {

    try {

      var heroId = socket.conn.id;
      let hero = model.getHero(heroId);
      let heroregion = hero.getRegion().getID()
      let monster = model.getMonsters().get(m)
      let monsterregion = monster!.getTile()

      if (hero.getTimeOfDay() > 9) {
        callback('notime', null, null)
      }
      else if (heroregion == monsterregion) {
        let monsterroll = monster!.rollDice()
        let heroroll = hero.roll()
        var winner = ''
        var dmg = 0

        if (monsterroll > heroroll) {
          winner = 'monster'
          dmg = monsterroll - heroroll
          hero.setWill(-dmg)
          //TODO project new hero will to client
          if (hero.getWill() < 1) {
            //TODO: handle DEATH!!!
          }
        }

        else if (monsterroll < heroroll) {
          winner = 'hero'
          dmg = heroroll - monsterroll
          monster!.setWill(monster!.getWill() - dmg)
          //TODO project new monster will to client...
          if (monster!.getWill() < 1) {
            //monster dead logic...
          }
        }

        else {
          winner = 'tie'
        }

        callback(monsterroll, heroroll, winner)
      }

      else {
        callback('outofrange', null,null)
      }
    }

    catch {
      console.log('no such monster name exists!')
    }

  })

  function getCurrentDate() {
    var currentDate = new Date();
    var hour = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
    var minute = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
    var second = (currentDate.getSeconds() < 10 ? '0' : '') + currentDate.getSeconds();

    return hour + ":" + minute + ":" + second;
  }


}

