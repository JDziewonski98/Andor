import { Tile } from '../objects/tile';
import { Farmer } from '../objects/farmer';
import { Hero } from '../objects/hero';
import { HourTracker } from '../objects/hourTracker';
import { game } from '../api';
import { WindowManager } from "../utils/WindowManager";
import { CollabWindow } from './collabwindow';
import {
  expandedWidth, expandedHeight, borderWidth,
  fullWidth, fullHeight, htX, htY, scaleFactor,
  mageTile, archerTile, warriorTile, dwarfTile,
  reducedWidth, reducedHeight,
  collabTextHeight, collabColWidth, collabRowHeight,
  wellTile1, wellTile2, wellTile3, wellTile4
} from '../constants'
import { MerchantWindow } from './merchantwindow';
import { Monster } from '../objects/monster';
import { HeroKind } from '../objects/HeroKind';


export default class GameScene extends Phaser.Scene {
  private heroes: Hero[];
  private hero: Hero;
  private ownHeroType: HeroKind;
  private tiles: Tile[];
  private farmers: Farmer[];
  private hourTracker: HourTracker;
  private gameinstance: game;
  private monsters: Monster[]

  private gameText;

  private cameraKeys;
  private cameraScrollSpeed = 15;
  private minZoom = 0.4;
  private maxZoom = 1;
  private zoomAmount = 0.01;

  constructor() {
    super({ key: 'Game' });
    // this.heroes = Array<Hero>(4); // This is adding 4 dummy elements at the start
    this.heroes = Array<Hero>();
    this.tiles = Array<Tile>();
    this.farmers = new Array<Farmer>();
    this.ownHeroType = HeroKind.Dwarf;
    this.monsters = new Array<Monster>();

  }

  public init(data) {
    this.gameinstance = data.controller;
    let type = data.heroType;
    console.log("GameScene created, client hero type: ", type);
    if (type === "dwarf")
      this.ownHeroType = HeroKind.Dwarf
    else if (type === "warrior")
      this.ownHeroType = HeroKind.Warrior
    else if (type === "mage")
      this.ownHeroType = HeroKind.Mage
    else if (type === "archer")
      this.ownHeroType = HeroKind.Archer
    this.sys.game.scene.bringToTop('BoardOverlay');
  }

  public preload() {
    this.load.image("gor", "../assets/gor.PNG")
    this.load.image("skral", "../assets/skral.PNG")
    this.load.image("wardrak", "../assets/wardrak.PNG")
    this.load.image("farmer", "../assets/farmer.png");
    this.load.multiatlas('tiles', './assets/tilesheet.json', 'assets')
    // TODO: Create a sprite sheet for heroes as well so they don't need an 
    // internal sprite to render their image
    this.load.image("well", "../assets/well.png");
  }

  public create() {
    this.cameraSetup();

    // Centered gameboard with border
    this.add.image(fullWidth / 2, fullHeight / 2, 'gameboard')
      .setDisplaySize(expandedWidth, expandedHeight);

    this.sys.game.scene.bringToTop('BoardOverlay');

    this.setRegions();

    var self = this;
    this.gameinstance.getHeros((herotypes) => {
      herotypes.forEach(type => {
        if (type === "archer") {
          self.addHero(HeroKind.Archer, archerTile, "archermale");
        } else if (type === "mage") {
          self.addHero(HeroKind.Mage, mageTile, "magemale");
        } else if (type === "warrior") {
          self.addHero(HeroKind.Warrior, warriorTile, "warriormale");
        } else if (type === "dwarf") {
          self.addHero(HeroKind.Dwarf, dwarfTile, "dwarfmale");
        }
      });
    })

    this.addMerchants();
    this.addFarmers()
    this.addMonsters()

    this.addWell(wellTile1, "well1")
    this.addWell(wellTile2, "well2")
    this.addWell(wellTile3, "well3")
    this.addWell(wellTile4, "well4")

    var style2 = {
      fontFamily: '"Roboto Condensed"',
      fontSize: "20px",
      backgroundColor: '#f00'
    }

    // start of game collab decision mock
    // TODO collab: automatically add this window when game starts instead of triggering on pointerdown
    this.gameText = this.add.text(600, 550, "COLLAB", style2).setOrigin(0.5)
    this.gameText.setInteractive();
    this.gameText.on('pointerdown', function (pointer) {
      if (this.scene.isVisible('collab')) {
        WindowManager.destroy(this, 'collab');
        return;
      }

      // TODO collab: Replace all this hardcoding UI shit with something nicer
      var res = { "gold": 5, "wineskin": 2 };
      // Determine width of the window based on how many resources are being distributed
      var width = (Object.keys(res).length + 1) * collabColWidth // Not sure if there's a better way of getting size of ts obj
      // Determine height of the window based on number of players involved
      var height = self.heroes.length * collabRowHeight + 24
      console.log(self.heroes.length, width, height)
      var collabWindowData = {
        controller: self.gameinstance,
        owner: self.heroes[0],
        heroes: self.heroes,
        resources: res,
        textOptions: null,
        x: reducedWidth / 2 - width / 2,
        y: reducedHeight / 2 - height / 2,
        w: width,
        h: height
      }
      WindowManager.create(this, 'collab', CollabWindow, collabWindowData);
    }, this);

  }

  private cameraSetup() {
    // Set bounds of camera to the limits of the gameboard
    var camera = this.cameras.main;
    camera.setBounds(0, 0, fullWidth, fullHeight);
    // Set keys for scrolling
    // Set keys for scrolling and zooming
    this.cameraKeys = this.input.keyboard.addKeys({
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right',
      zoomIn: 'plus',
      zoomOut: 'minus'
    });
  }

  private setRegions() {
    // Note that regions 73-79 and 83 are unused, but created anyways to preserve direct
    // indexing between regions array and region IDs
    var tilesData = require("../../assets/xycoords").map;
    var treeTile = this.textures.get('tiles').getFrameNames()[12];
    for (var element in tilesData) {
      var tile = new Tile(element, this, tilesData[element].xcoord * scaleFactor + borderWidth, tilesData[element].ycoord * scaleFactor + borderWidth, treeTile);
      this.tiles[element] = tile;
      tile.setInteractive();
      this.add.existing(tile);
    }

    /// for movement callback, ties pointerdown to move request
    var self = this
    this.tiles.map(function (tile) {
      tile.on('pointerdown', function () {
        self.gameinstance.moveRequest(tile.id, updateMoveRequest)
      })
    })

    this.gameinstance.updateMoveRequest(updateMoveRequest)

    function updateMoveRequest(heroKind, tileID) {
      self.heroes.forEach((hero: Hero) => {
        if (hero.getKind().toString() === heroKind) {
          hero.moveTo(self.tiles[tileID])
        }
      })
    }


  }

  private addMerchants() {
    const merchtile_18: Tile = this.tiles[18];
    const merchtile_57: Tile = this.tiles[57];
    const merchtile_71: Tile = this.tiles[71];

    var self = this;

    merchtile_18.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == merchtile_18.id) {

        if (this.scene.isVisible('merchant1')) {
          WindowManager.destroy(self, 'merchant1');
        } else {
          WindowManager.create(self, 'merchant1', MerchantWindow, self.gameinstance);
          let window = WindowManager.get(this, 'merchant1')
          window.setName('Merchant')
        }

      }

    }, this);

    merchtile_57.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == merchtile_18.id) {

        if (this.scene.isVisible('merchant2')) {
          WindowManager.destroy(self, 'merchant2');
        } else {
          WindowManager.create(self, 'merchant2', MerchantWindow, self.gameinstance);
          let window = WindowManager.get(this, 'merchant2')
          window.setName('Merchant')
        }

      }

    }, this);

    merchtile_71.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == merchtile_18.id) {

        if (this.scene.isVisible('merchant3')) {
          WindowManager.destroy(self, 'merchant3');
        } else {
          WindowManager.create(self, 'merchant3', MerchantWindow, self.gameinstance);
          let window = WindowManager.get(this, 'merchant3')
          window.setName('Merchant')
        }

      }

    }, this);

  }


  private addMonsters() {

    const gortile1: Tile = this.tiles[8];
    const gortile2: Tile = this.tiles[20];
    const gortile3: Tile = this.tiles[21];
    const gortile4: Tile = this.tiles[26];
    const gortile5: Tile = this.tiles[48];
    const skraltile: Tile = this.tiles[19];

    let gor1: Monster = new Monster(this, gortile1, 'gor').setInteractive().setScale(.5);
    let gor2: Monster = new Monster(this, gortile2, 'gor').setInteractive().setScale(.5);
    let gor3: Monster = new Monster(this, gortile3, 'gor').setInteractive().setScale(.5);
    let gor4: Monster = new Monster(this, gortile4, 'gor').setInteractive().setScale(.5);
    let gor5: Monster = new Monster(this, gortile5, 'gor').setInteractive().setScale(.5);
    let skral: Monster = new Monster(this, skraltile, 'skral').setInteractive().setScale(.5);

    this.monsters.push(gor1);
    this.monsters.push(gor2);
    this.monsters.push(gor3);
    this.monsters.push(gor4);
    this.monsters.push(gor5);
    this.monsters.push(skral);

    gortile1.monster = gor1
    gortile2.monster = gor2
    gortile3.monster = gor3
    gortile4.monster = gor4
    gortile5.monster = gor5
    skraltile.monster = skral

    let self = this;
    this.monsters.forEach(monster =>
      self.add.existing(monster)
    );


  }

  private addFarmers() {

    const farmertile_0: Tile = this.tiles[24];
    const farmertile_1: Tile = this.tiles[36];

    let farmer_0: Farmer = new Farmer(this, farmertile_0, 'farmer').setDisplaySize(40, 40);
    let farmer_1: Farmer = new Farmer(this, farmertile_1, 'farmer').setDisplaySize(40, 40);

    farmer_0.setInteractive();
    farmer_1.setInteractive();

    this.farmers.push(farmer_0);
    this.farmers.push(farmer_1);

    farmertile_0.farmer.push(farmer_0);
    farmertile_0.farmerexist = true;
    farmertile_1.farmer.push(farmer_1);
    farmertile_1.farmerexist = true;

    this.add.existing(farmer_0);
    this.add.existing(farmer_1);

    var self = this;

    farmer_0.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == self.farmers[0].tile.id) {
        self.gameinstance.pickupFarmer(self.heroes[0], function () {
          farmer_0.destroy();
          //TODO: Add farmer to player inventory and display on player inventory card
        });
      }

    }, this);

    farmer_1.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == self.farmers[1].tile.id) {
        self.gameinstance.pickupFarmer(self.heroes[0], function () {
          farmer_1.destroy();
        });
      }

    }, this);


    this.gameinstance.updateFarmer(function () {
      farmer_0.destroy();
    });

    this.gameinstance.updateFarmer(function () {
      farmer_1.destroy();
    });
  }

  private addHero(type: HeroKind, tileNumber: number, texture: string) {
    const tile: Tile = this.tiles[tileNumber]
    let hero: Hero = new Hero(this, tile, texture, type).setDisplaySize(40, 60);
    this.heroes.push(hero);

    tile.hero = hero;
    tile.heroexist = true;
    this.add.existing(hero);
    if (this.ownHeroType === type) this.hero = hero;
  }

  private addWell(tileNumber: number, wellName: string) {
    const tile: Tile = this.tiles[tileNumber]
    const well = this.add.image(tile.x, tile.y, "well").setDisplaySize(60, 40)
    well.name = wellName;

    well.setInteractive()
    var self = this

    well.on("pointerdown", function () {

      self.gameinstance.useWell(function () {
        self[wellName].setTint(0x404040)
        if (tile.hero.getWillPower() <= 17) {
          tile.hero.setwillPower(3)
        }
        else if (tile.hero.getWillPower() <= 20 && tile.hero.getWillPower() > 17) {
          tile.hero.setwillPower(20 - tile.hero.getWillPower())
        }

      });
    });

    this.gameinstance.updateWell(function () {
      self[wellName].setTint(0x404040)
      if (tile.hero.getWillPower() <= 17) {
        tile.hero.setwillPower(3)
      }
      else if (tile.hero.getWillPower() <= 20 && tile.hero.getWillPower() > 17) {
        tile.hero.setwillPower(20 - tile.hero.getWillPower())
      }
    });
  }

  // Creating the hour tracker
  private hourTrackerSetup() {
    //x, y coorindates
    var htx = htX;
    var hty = htY;
    // Hero icons
    var mageHtIcon = this.add.sprite(htx, hty, 'magemale').setDisplaySize(40, 40);
    var dwarfHtIcon = this.add.sprite(htx, hty, 'dwarfmale').setDisplaySize(40, 40);
    var archerHtIcon = this.add.sprite(htx, hty, 'archermale').setDisplaySize(40, 40);
    var warriorHtIcon = this.add.sprite(htx, hty, 'warriormale').setDisplaySize(40, 40);

    this.hourTracker = new HourTracker(this, htx, hty, [mageHtIcon, dwarfHtIcon, archerHtIcon, warriorHtIcon]);

    // Hero ids are hardcoded for now, need to be linked to game setup
    mageHtIcon.x = this.hourTracker.heroCoords[0][0];
    mageHtIcon.y = this.hourTracker.heroCoords[0][1];
    dwarfHtIcon.x = this.hourTracker.heroCoords[1][0];
    dwarfHtIcon.y = this.hourTracker.heroCoords[1][1];
    archerHtIcon.x = this.hourTracker.heroCoords[2][0];
    archerHtIcon.y = this.hourTracker.heroCoords[2][1];
    warriorHtIcon.x = this.hourTracker.heroCoords[3][0];
    warriorHtIcon.y = this.hourTracker.heroCoords[3][1];

    // we're not actually adding the hourTracker, we're adding it's internal sprite
    this.hourTracker.depth = 5;
    this.hourTracker.depth = 0;
    for (var h of this.heroes) {
      h.hourTracker = this.hourTracker;
    }

    this.hourTracker.setInteractive();
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