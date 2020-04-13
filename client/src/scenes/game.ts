import { Farmer, Hero, HourTracker, Monster, HeroKind, Well, Tile, Narrator, EventCard } from '../objects';
import { game } from '../api';
import { WindowManager, StoryWindow, CollabWindow, MerchantWindow, DeathWindow, Fight, BattleInvWindow, GameOverWindow, TradeWindow } from "./windows";
import { RietburgCastle } from './rietburgcastle';
import BoardOverlay from './boardoverlay';

import {
  expandedWidth, expandedHeight, borderWidth,
  fullWidth, fullHeight, htX, htY, scaleFactor,
  mageTile, archerTile, warriorTile, dwarfTile,
  reducedWidth, reducedHeight,
  collabTextHeight, collabColWidth, collabRowHeight,
  wellTile1, wellTile2, wellTile3, wellTile4,
  mOffset, enumPositionOfNarrator
} from '../constants'
//import { TradeHostWindow } from './tradehostwindow';

import { TileWindow } from './tilewindow';
import { Prince } from '../objects/Prince';


export default class GameScene extends Phaser.Scene {
  private heroes: Hero[];
  private hero: Hero;
  private startingHeroRank: number;
  private ownHeroType: HeroKind;

  private tiles: Tile[];
  // Note acui: was having trouble using wells map with number typed keys, so converting to strings
  private wells: Map<string, Well>;

  private farmers: Farmer[];
  private hourTracker: HourTracker;
  private gameinstance: game;
  private monsters: Monster[];
  private monsterNameMap: Map<string, Monster>;
  private castle: RietburgCastle;
  private prince: Prince;

  private narrator: Narrator;
  private gameStartHeroPosition: number;
  private event: EventCard
  private activeEvents: Array<EventCard>
  private mockText;

  private cameraKeys;
  private cameraScrollSpeed = 15;
  private minZoom = 0.4;
  private maxZoom = 1;
  private zoomAmount = 0.01;

  private sceneplugin;
  private turntext;

  private overlay;

  private shiftKey;
  private ctrlKey;

  constructor() {
    super({ key: 'Game' });
    this.heroes = Array<Hero>();
    this.tiles = Array<Tile>();
    this.wells = new Map();
    this.farmers = new Array<Farmer>();
    this.ownHeroType = HeroKind.Dwarf;
    this.monsters = new Array<Monster>();
    this.monsterNameMap = new Map();
    this.castle = new RietburgCastle();
  }

  public init(data) {
    this.gameinstance = data.controller;
    let type = data.heroType;
    console.log("GameScene created, client hero type: ", type);
    this.ownHeroType = type;
  }

  public preload() {
    this.load.image("gor", "../assets/gor.PNG")
    this.load.image("skral", "../assets/skral.PNG")
    this.load.image("wardrak", "../assets/wardrak.PNG")
    this.load.image("fortress", "../assets/fortress.png")
    this.load.image("farmer", "../assets/farmer.png");
    this.load.multiatlas('tiles', './assets/tilesheet.json', 'assets')
    this.load.image("well", "../assets/well.png");

    this.load.image("WillPower2", "../assets/will2.png");
    this.load.image("WillPower3", "../assets/will3.png");
    this.load.image("Gold", "../assets/gold.png");
    this.load.image("EventCard", "../assets/event.png");
    this.load.image("Gor", "../assets/gorfog.png");
    this.load.image("WitchFog", "../assets/witchfog.png");
    this.load.image("WineskinFog", "../assets/wineskinfog.png");

    this.load.image("witch", "../assets/witch.png");

    this.load.image("item_border", "../assets/border.png"); // uses hex 4b2504
    this.load.image("hero_border", "../assets/big_border.png");

    //items
    // this.load.image("Brew", "../assets/brew.png");
    // this.load.image("Wineskin", "../assets/wineskin.png");
    this.load.image("brew", "../assets/brew.png");
    this.load.image("wineskin", "../assets/wineskin.png");
    this.load.image("bow", "../assets/bow.PNG");
    this.load.image("falcon", "../assets/falcon.PNG");
    this.load.image("helm", "../assets/helm.PNG");
    this.load.image("menubackground", "../assets/menubackground.png");
    this.load.image("blue_runestone", "../assets/runestone_b.PNG");
    this.load.image("green_runestone", "../assets/runestone_g.PNG");
    this.load.image("yellow_runestone", "../assets/runestone_y.PNG");
    this.load.image("blue_runestone_h", "../assets/runestone_b_hidden.png");
    this.load.image("green_runestone_h", "../assets/runestone_g_hidden.png");
    this.load.image("yellow_runestone_h", "../assets/runestone_y_hidden.png");
    this.load.image("prince", "../assets/prince.png");
    this.load.image("telescope", "../assets/telescope.PNG");
    this.load.image("half_wineskin", "../assets/half_wineskin.jpg")
    this.load.image("half_brew", "../assets/half_brew.jpg")
    this.load.image("gold", "../assets/gold.png")

    this.load.image("Strength", "../assets/strength.png");
    this.load.image("pawn", "../assets/pawn.png");
    this.load.image('dshield', './assets/disabled_cracked_shield.png')
    this.load.image('okay', './assets/ok.png')
  }

  public create() {
    var self = this;

    this.cameraSetup();
    this.shiftKey = this.input.keyboard.addKey('shift');
    this.ctrlKey = this.input.keyboard.addKey('CTRL');
    this.sceneplugin = this.scene
    // Centered gameboard with border
    this.add.image(fullWidth / 2, fullHeight / 2, 'gameboard')
      .setDisplaySize(expandedWidth, expandedHeight);

    this.gameinstance.getGameData((data) => {
      console.log("GAME DATA IS:::::::::::::\n", data)

      this.setRegions(data.regions);
      this.addFog(data.fogs);
      this.addShieldsToRietburg(data.castle.numDefenseShields - data.castle.numDefenseShieldsUsed);

      data.monsters.forEach(monster => {
        this.addMonster(monster[1].tileID, monster[1].type, monster[0]);
      })

      data.farmers.forEach(farmer => {
        this.addFarmer(farmer.id, farmer.tileID);
      })

      data.heroList.forEach(hero => {
        this.addHero(hero[1].hk, hero[1].region.id, hero[1].hk);
      })

      this.hourTrackerSetup();

      this.setUpListeners();

      // Add overlay to game
      const overlayData = {
        gameinstance: this.gameinstance,
        tiles: this.tiles,
        monsterMap: this.monsterNameMap,
        // gameTweens: self.tweens, not sure if this needs to be passed
        hourTracker: this.hourTracker,
        wells: this.wells,
        hk: this.ownHeroType,
        clientheroobject: this.hero
      };
      this.overlay = new BoardOverlay(overlayData);
      this.scene.add('BoardOverlay', this.overlay, true);

      // Need to wait for heroes to be created before creating collab decision
      this.startingCollabDecisionSetup();
      // Note that starting hero rank gets determined in collab setup
      if (this.hero.tile.id == this.startingHeroRank) {
        console.log("first turn goes to hero rank", this.startingHeroRank);
        this.gameinstance.setMyTurn(true);
      }

      // Add narrator: this happens here because we want initial game instructions to be
      // added on top of the collab decision
      this.gameStartHeroPosition = data.startGamePos;
      console.log("gameStartHeroPos", this.gameStartHeroPosition);
      this.addNarrator();
      // Listens for all updates triggered by narrator advancing
      this.receiveNarratorEvents();
    })

    setInterval(() => {
      console.log("********* SAVING GAME");
      this.gameinstance.save();
    }, 10000);
    // this.addMerchants();

    //Event Card adding at start of game
    //this.gameinstance.newEvent()
    //this.addEventCard("YOOOOOOOOOO")
    // this.gameinstance.addMonster((type, tile, id) => {
    //   this.addMonster(tile, type, id);
    // })
    this.gameinstance.newEventListener((event: EventCard) => {
      this.applyEvent(event)
    })
    // function applyEvent(event, this){
    //   console.log("Wassup mf")
    //   this.addEventCard(event)
    // }


  }

  private cameraSetup() {
    // Set bounds of camera to the limits of the gameboard
    var camera = this.cameras.main;
    camera.setBounds(0, 0, fullWidth, fullHeight);
    // Set keys for scrolling
    // Set keys for scrolling and zooming
    this.cameraKeys = this.input.keyboard.addKeys({
      up: 'w',
      down: 's',
      left: 'a',
      right: 'd',
      zoomIn: 'q',
      zoomOut: 'e'
    });
  }

  private setRegions(tilesData) {
    // Note that regions 73-79 and 83 are unused, but created anyways to preserve direct
    // indexing between regions array and region IDs
    // var tilesData = require("../utils/xycoords").map;
    var treeTile = this.textures.get('tiles').getFrameNames()[12];
    for (let t of tilesData) {
      // console.log(t)
      var tile = new Tile(t.id, this, t.x * scaleFactor + borderWidth, t.y * scaleFactor + borderWidth, treeTile, t.adjRegionsIds);
      this.tiles[t.id] = tile;
      tile.setInteractive();
      this.add.existing(tile);

      if (t.hasWell) {
        // coordinates taken from previous version, adding wells to allocated wells positions
        switch (t.id) {
          case 5:
            this.addWell(209, 2244, t.id as number);
            break;
          case 35:
            this.addWell(1353, 4873, t.id as number);
            break;
          case 45:
            this.addWell(7073, 3333, t.id as number);
            break;
          case 55:
            this.addWell(5962, 770, t.id as number);
            break;
        }

        // this approach adds well on top of the trees
        // this.addWell(t.x, t.y, t.id as number);
      }
    }

    // click: for movement callback, ties pointerdown to move request
    // shift+click: tile items pickup interface
    // ctrl+click: move the prince
    var self = this
    this.tiles.map(function (tile) {
      tile.on('pointerdown', function (pointer) {
        if (this.shiftKey.isDown) {
          const tileWindowID = `tileWindow${tile.getID()}`;
          if (this.scene.isVisible(tileWindowID)) {
            // console.log(this)
            var thescene = WindowManager.get(this, tileWindowID)
            thescene.disconnectListeners()
            WindowManager.destroy(this, tileWindowID);
          } else {
            // width of tile window depends on number of items on it
            this.gameinstance.getTileItems(tile.id, function (tileItems) {
              let items = tileItems;
              // let itemsSize = Object.keys(items).length;
              WindowManager.create(self, tileWindowID, TileWindow,
                {
                  controller: self.gameinstance,
                  x: pointer.x + 20,
                  y: pointer.y + 20,
                  w: 670, // based on total number of unique items that could populate
                  h: 60,
                  tileID: tile.getID(),
                  items: items
                }
              );
            })
          }
        } else if (this.ctrlKey.isDown) {  //to move prince, hold ctrl key
          console.log("It is my turn: ", self.gameinstance.myTurn)
          self.gameinstance.movePrinceRequest(tile.id, updateMovePrinceRequest)
        } else {
          console.log("It is my turn: ", self.gameinstance.myTurn)
          self.gameinstance.moveRequest(tile.id, updateMoveRequest)
        }
      }, this)
    }, this)

    this.gameinstance.updateMoveRequest(updateMoveRequest)
    this.gameinstance.updateMovePrinceRequest(updateMovePrinceRequest)

    function updateMoveRequest(heroKind, tileID) {
      self.heroes.forEach((hero: Hero) => {
        if (hero.getKind().toString() === heroKind) {
          let newCoords = hero.getPosOnTile(self.tiles[tileID]);
          self.tweens.add({
            targets: hero,
            x: newCoords.x,
            y: newCoords.y,
            duration: 500,
            ease: 'Power2',
            completeDelay: 400,
            onComplete: function () { hero.moveTo(self.tiles[tileID]) }
          });
        }
      })
    }

    function updateMovePrinceRequest(heroKind, tileID, numPrinceMoves) {
      numPrinceMoves = +numPrinceMoves;
      self.heroes.forEach((hero: Hero) => {
        if (hero.getKind().toString() === heroKind) {
          self.prince.moveTo(self.tiles[tileID])
          if (numPrinceMoves % 4 === 1) {
            hero.incrementHour();
          }
        }
      })
    }
  }

  private addShieldsToRietburg(numShields) {
    let s1 = this.add.sprite(85, 188, 'dshield').setDisplaySize(65, 81)
    let s2 = this.add.sprite(153, 188, 'dshield').setDisplaySize(65, 81)
    let s3 = this.add.sprite(218, 188, 'dshield').setDisplaySize(65, 81)
    let s4 = this.add.sprite(85, 310, 'dshield').setDisplaySize(65, 81)
    let s5 = this.add.sprite(153, 310, 'dshield').setDisplaySize(65, 81)
    let s6 = this.add.sprite(85, 430, 'dshield').setDisplaySize(65, 81)

    this.castle.shields.push(s1)
    this.castle.shields.push(s2)
    this.castle.shields.push(s3)
    this.castle.shields.push(s4)
    this.castle.shields.push(s5)
    this.castle.shields.push(s6)

    var self = this;
    for (var i = 0; i < numShields; i++) {
      self.castle.shields[i].visible = false;
    }
  }

  private addMerchant(tileID: number) {
    const merchtile_18: Tile = this.tiles[18];
    const merchtile_57: Tile = this.tiles[57];
    const merchtile_71: Tile = this.tiles[71];

    var self = this;

    merchtile_18.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == merchtile_18.id) {

        if (this.scene.isVisible('merchant1')) {
          WindowManager.destroy(self, 'merchant1');
        } else {
          WindowManager.create(self, 'merchant1', MerchantWindow, { controller: self.gameinstance });
          let window = WindowManager.get(self, 'merchant1')

        }

      }

    }, this);

    merchtile_57.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == merchtile_18.id) {

        if (this.scene.isVisible('merchant2')) {
          WindowManager.destroy(self, 'merchant2');
        } else {
          WindowManager.create(self, 'merchant2', MerchantWindow, { controller: self.gameinstance });
          let window = WindowManager.get(self, 'merchant2')
        }

      }

    }, this);

    merchtile_71.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == merchtile_18.id) {

        if (this.scene.isVisible('merchant3')) {
          WindowManager.destroy(self, 'merchant3');
        } else {
          WindowManager.create(self, 'merchant3', MerchantWindow, { controller: self.gameinstance });
          let window = WindowManager.get(self, 'merchant3')
        }

      }

    }, this);

  }

  private addMonster(monsterTile: number, type: string, id: string) {
    const tile: Tile = this.tiles[monsterTile];

    let monster: Monster = new Monster(this, tile, type, id).setInteractive().setScale(.5);
    this.monsters.push(monster);
    this.monsterNameMap[monster.name] = monster;
    tile.setMonster(monster);
    this.add.existing(monster);
    monster.on('pointerdown', function (pointer) {
      if (this.scene.isVisible(monster.name)) {
        WindowManager.destroy(this, monster.name);
      }
      else {
        WindowManager.create(this, monster.name, Fight, {
          controller: this.gameinstance,
          hero: this.hero, monster: monster, heroes: this.heroes,
          overlayRef: this.overlay
        });
        this.scene.pause()
      }
    }, this)
  }

  private addFarmer(id: number, tileID: number) {
    const tile: Tile = this.tiles[tileID];
    const farmerObj = new Farmer(id, this, tile, 'farmer').setDisplaySize(40, 40).setInteractive();
    this.farmers.push(farmerObj);
    tile.farmers.push(farmerObj);
    this.add.existing(farmerObj);

    var self = this;

    farmerObj.on('pointerdown', () => {
      self.gameinstance.pickupFarmer(farmerObj.tile.getID(), function (tileid) {
        farmerObj.destroy();
      });
    }, this);
  }


  private addHero(type: HeroKind, tileNumber: number, texture: string) {
    const tile: Tile = this.tiles[tileNumber]
    let hero: Hero = new Hero(this, tile, texture, type).setDisplaySize(40, 40);
    this.heroes.push(hero);
    // tile.hero = hero;
    this.add.existing(hero);
    if (this.ownHeroType === type) {
      this.hero = hero;
    }
  }

  private addWell(x, y, tileNumber: number) {
    const tile: Tile = this.tiles[tileNumber];
    const newWell = new Well(this, x * scaleFactor + borderWidth,
      y * scaleFactor + borderWidth, "well", tile, this.gameinstance).setDisplaySize(48, 54);
    this.add.existing(newWell);
    this.wells.set("" + newWell.getTileID(), newWell);
  }

  // Add the narrator pawn to the game board
  private addNarrator() {
    var self = this;

    this.gameinstance.getNarratorPosition(function (pos: number) {
      // Trigger start of game instructions/story
      if (pos == -1) {
        WindowManager.create(self, `story0`, StoryWindow, {
          x: reducedWidth / 2,
          y: reducedHeight / 2,
          id: 0
        })

        // Last hero to enter the game triggers placement of the runestone legend
        // This is the only "narrator event" that gets directly triggered from the client
        // because it doesn't happen on a monster kill or end of day
        if (self.gameStartHeroPosition == self.heroes.length) {
          self.gameinstance.placeRuneStoneLegend();
        }
      }

      // Otherwise we just add the narrator at whatever position the backend has stored
      console.log("creating narrator at position", pos);
      self.narrator = new Narrator(self, pos, "pawn", self.gameinstance).setScale(0.5);
      self.add.existing(self.narrator);
    })
  }

  private receiveNarratorEvents() {
    var self = this;

    // runestonePos is an optional argument that is only passed back for the start of game
    this.gameinstance.updateNarrator(function (pos: number, runestonePos = -1, stoneLocs = [], win: boolean = false) {
      // Switch on the new narrator position
      self.narrator.advance();
      console.log("client received narrator advance", pos, runestonePos, stoneLocs, win)
      switch (pos) {
        case 0: // Initial storytelling is done, rune legend card placed, narrator at A
          // TODO NARRATOR: update rune card UI and position
          self.placeRunestoneCard(runestonePos);
          break;
        case self.narrator.getRunestonePos():
          // place the runestones on the board
          self.narratorRunestones(stoneLocs);
          break;
        case 2: // Legend card C
          self.narratorC();
          break;
        case 6: // Legend card G
          self.narratorG();
          break;
        case 13: // Legend card N
          console.log("case 13");
          self.narratorN(win); 
          break;
      }
    })
  }

  private placeRunestoneCard(runestonePos: number) {
    let yPos = (6100 - (runestonePos * 455)) * scaleFactor + borderWidth

    // place the runestone card marker on the legend track
    this.add.image(2450, yPos, 'weed').setDisplaySize(40, 40);
    this.narrator.setRunestonePos(runestonePos);
  }

  private narratorRunestones(stoneLocs: number[]) {
    console.log("client narratorRunestones", stoneLocs)
    // Display StoryWindows
    WindowManager.create(this, `story6`, StoryWindow, {
      x: reducedWidth / 2,
      y: reducedHeight / 2,
      id: 6,
      locs: stoneLocs
    })
  }

  // Note that adding monsters is handled in setupListeners
  private narratorC() {
    console.log("client narratorC")
    // Place farmer and prince, these are hardcoded for now
    this.addFarmer(2, 28);

    this.prince = new Prince(this, this.tiles[72], 'prince').setScale(.15);
    this.add.existing(this.prince);
    // TODO NARRATOR: Display StoryWindows
    WindowManager.create(this, `story3`, StoryWindow, {
      x: reducedWidth / 2,
      y: reducedHeight / 2,
      id: 3
    })
  }

  private narratorG() {
    // Remove prince
    this.prince.destroy();
    // TODO NARRATOR: Display StoryWindows
    WindowManager.create(this, `story7`, StoryWindow, {
      x: reducedWidth / 2,
      y: reducedHeight / 2,
      id: 7
    })
  }

    private narratorN(win: boolean) {
        // console.log("At narrator NNNNN. client game narratorN: ", win)
        var self = this;
        if (win) {
            console.log("kokoniiruyo")
            WindowManager.create(self, `story9`, StoryWindow, {
                x: reducedWidth / 2,
                y: reducedHeight / 2,
                id: 9
            })
        }
        else {
            WindowManager.create(self, `story10`, StoryWindow, {
                x: reducedWidth / 2,
                y: reducedHeight / 2,
                id: 10
            })
        }
        
    }

  private addFog(fogs) {
    fogs.forEach((fog) => {
      const tile: Tile = this.tiles[fog[0]];
      const f = this.add.sprite(tile.x + 50, tile.y - 5, fog[1]).setDisplaySize(60, 60);
      f.name = fog[1];
      f.setTint(0x101010); // darken
      tile.setFog(f) // add to tile
      f.setInteractive()
      this.add.existing(f);
      var self = this
      f.on("pointerdown", (pointer) => {
        self.gameinstance.getHeroItems(self.hero.getKind(), function (itemdict) {
          self.gameinstance.getAdjacentTiles(self.hero.tile.id, function (adjtileids) {
            var flag = false
            //why are we using a loop like this instead of .includes()?? good question, includes() was not working for some reason.
            // @Jacek Includes probably wasnt working bceause tile.id is a number but the contents of adjtileids are passed as strings by socket.
            for (let i = 0; i < adjtileids.length; i++) {
              console.log(adjtileids[i], tile.id)
              if (adjtileids[i] == tile.id) {
                flag = true
              }
            }
            if (itemdict['smallItems'].includes('telescope') && flag) {
              console.log('using telescope.')
              f.clearTint();
              setTimeout(() => {
                f.setTint(0x101010);
              }, 800);
            }
            else {
              self.gameinstance.useFog(f.name, tile.id, (tile) => {
                console.log(tile, typeof tile)
                // Reveals the fog for set timeout before removing
                let f = self.tiles[+tile].getFog();
                f.clearTint();
                setTimeout(() => {
                  f.destroy()
                }, 800);
              })
            }
          })
        })
      }, this)
    })

    // Reveals the fog for set timeout before removing
    this.gameinstance.destroyFog((tile) => {
      let f = this.tiles[+tile].getFog();
      f.clearTint();
      setTimeout(() => {
        f.destroy()
      }, 800);
    });
  }

  //for specific events which need to apply a unique ui effect, or something of that nature
  private applyEvent(event: EventCard) {
    console.log("Applying event")
    if (event.id == 2) {
      //wind accross screen or something like that
    }
    this.addEventCard(event)
  }

  private addEventCard(event: EventCard) {
    var newEvent = new EventCard(this, event.id, event.flavorText, event.desc)

    //remove current event from scene
    if (this.event != null) {
      this.event.destroy(true)
    }

    //add new event to scene
    this.event = newEvent
    this.add.existing(newEvent)
  }

  private startingCollabDecisionSetup() {
    var self = this;

    var res = new Map([
      ["gold", 5],
      ["wineskin", 2]
    ])
    // Determine width of the window based on how many resources are being distributed
    var width = (res.size + 1) * collabColWidth; // Not sure if there's a better way of getting size of ts obj
    // Determine height of the window based on number of players involved
    var height = (self.heroes.length + 2) * collabRowHeight;
    // Set data depending on whether the client is the owner of the decision
    // Get hero of lowest rank, based on their starting tile
    var heroRanks = [];
    for (let hero of self.heroes) { heroRanks.push(hero.tile.id); }
    self.startingHeroRank = Math.min(...heroRanks);
    var collabWindowData = (self.hero.tile.id == self.startingHeroRank) ?
      {
        controller: self.gameinstance,
        isOwner: true,
        heroes: self.heroes,
        resources: res,
        textOptions: null,
        x: reducedWidth / 2 - width / 2,
        y: reducedHeight / 2 - height / 2,
        w: width,
        h: height,
        infight: false,
        overlayRef: self.overlay
      } :
      {
        controller: self.gameinstance,
        isOwner: false,
        x: reducedWidth / 2 - width / 2,
        y: reducedHeight / 2 - height / 2,
        w: 200,
        h: 100,
        infight: false,
        overlayRef: self.overlay
      }
    WindowManager.create(this, 'collab', CollabWindow, collabWindowData);
    // Freeze main game while collab window is active
    this.scene.pause();
  }

  // Creating the hour tracker
  private hourTrackerSetup() {
    //x, y coordinates
    var htx = htX;
    var hty = htY;
    var self = this
    var heroSprites = new Map();
    for (var h of this.heroes) {
      var sprite = self.add.sprite(htx, hty, h.texture.key).setDisplaySize(40, 40)
      heroSprites.set(h.getKind(), sprite);
      switch (h.getKind()) {
        case HeroKind.Archer:
          sprite.x = htx - 20
          sprite.y = hty - 20
          break
        case HeroKind.Dwarf:
          sprite.x = htx + 20
          sprite.y = hty - 20
          break
        case HeroKind.Mage:
          sprite.x = htx - 20
          sprite.y = hty + 20
          break
        case HeroKind.Warrior:
          sprite.x = htx + 20
          sprite.y = hty + 20
          break
      }
    }
    this.hourTracker = new HourTracker(this, htx, hty, heroSprites);

    // we're not actually adding the hourTracker, we're adding it's internal sprite
    this.hourTracker.depth = 5;
    this.hourTracker.depth = 0;
    for (var h of this.heroes) {
      h.hourTracker = this.hourTracker;
    }
  }

  private setUpListeners() {
    var self = this;

    // listener to add monsters for narrator, fogs, and events
    this.gameinstance.addMonster((type, tile, id) => {
      this.addMonster(tile, type, id);
    })

    // Listen for turn to be passed to yourself
    this.gameinstance.yourTurn()

    // Reveal the witch
    this.gameinstance.revealWitch(tileID => {
      // Witch story
      WindowManager.create(self, `story8`, StoryWindow, {
        x: reducedWidth / 2,
        y: reducedHeight / 2,
        id: 8
      })
      // Place the witch on tileID
      var witch = this.add.image(this.tiles[tileID].x + 50, this.tiles[tileID].y - 5, "witch");
      witch.setInteractive();
      witch.on('pointerdown', () => {
        // TODO: Merchant witch interface, wait for merchants to be completed
        console.log("Buy brew from witch");
      })
    })

    /**
     * FIGHT LISTENERS
     */
    this.gameinstance.receiveBattleInvite(function (monstertileid) {
      if (self.scene.isVisible('battleinv')) {
        WindowManager.destroy(self, 'battleinv');
      }
      WindowManager.create(self, 'battleinv', BattleInvWindow,
        {
          controller: self.gameinstance,
          hero: self.hero,
          gamescene: self,
          monstertileid: monstertileid,
          overlayRef: self.overlay
        });

    })
    this.gameinstance.receiveDeathNotice(function () {
      if (self.scene.isVisible('deathnotice')) {
        WindowManager.destroy(self, 'deathnotice');
      }
      WindowManager.create(self, 'deathnotice', DeathWindow, { controller: self.gameinstance });
    })
    // Listening for shields lost due to monster attack
    this.gameinstance.updateShields(function (shieldsRemaining: number) {
      for (let i = 0; i < 6; i++) {
        if (i >= shieldsRemaining) {
          self.castle.shields[i].visible = true;
        } else {
          self.castle.shields[i].visible = false;
        }
      }
    })

    // FARMERS
    this.gameinstance.destroyFarmer(function (tileid) {
      let pickedFarmer: Farmer = self.tiles[tileid].farmers.pop();
      pickedFarmer.destroy()
    });

    this.gameinstance.addFarmer(function (tileid, farmerid) {
      if (tileid === 0) {
        for (var i = 0; i < 6; i++) {
          if (self.castle.shields[i].visible == true) {
            self.castle.shields[i].visible = false;
            break;
          }
        }
      } else {
        self.addFarmer(+farmerid, tileid)
      }
    });

    // TRADE
    this.gameinstance.receiveTradeInvite(function (host, invitee) {
      WindowManager.create(self, 'tradewindow', TradeWindow, { gameinstance: self.gameinstance, hosthero: host, inviteehero: invitee, parentkey: 'None', clienthero: invitee })
    })

    // Listen for end of game state
    this.gameinstance.receiveEndOfGame(function () {
      let windowData = {
        controller: self.gameinstance,
        x: reducedWidth / 2 - 200,
        y: reducedHeight / 2 - 100,
        w: 400,
        h: 200,
      }
      // Display end of game window
      WindowManager.create(self, 'gameover', GameOverWindow, windowData);
      // Freeze main game while collab window is active
      self.scene.pause();

    });

    this.gameinstance.receiveUpdateHeroTracker(function (hero) {
      for (let h of self.heroes) {
        if (h.getKind() == hero) {
          h.incrementHour()
        }
      }
    })

    this.gameinstance.receivePlayerDisconnected((hk) => {
      console.log("FREEZE GAME ", hk, " DISCONNECTED")
      this.scene.pause();
    })

  }

  public update() {
    var camera = this.cameras.main;

    // Scroll updates
    if (this.cameraKeys["up"].isDown) {
      camera.scrollY -= this.cameraScrollSpeed;
    } else if (this.cameraKeys["down"].isDown) {
      camera.scrollY += this.cameraScrollSpeed;
    }

    if (this.cameraKeys["left"].isDown) {
      camera.scrollX -= this.cameraScrollSpeed;
    } else if (this.cameraKeys["right"].isDown) {
      camera.scrollX += this.cameraScrollSpeed;
    }

    // Zoom updates
    if (this.cameraKeys["zoomIn"].isDown && camera.zoom < this.maxZoom) {
      camera.zoom += this.zoomAmount;
    } else if (this.cameraKeys["zoomOut"].isDown && camera.zoom > this.minZoom) {
      camera.zoom -= this.zoomAmount;
    }
  }

}