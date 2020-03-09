import { Tile } from '../objects/tile';
import { Farmer } from '../objects/farmer';
import { Hero } from '../objects/hero';
import { HourTracker } from '../objects/hourTracker';
import { game } from '../api';
import {
  expandedWidth, expandedHeight, borderWidth,
  fullWidth, fullHeight, htX, htY, scaleFactor,
  mageTile, archerTile, warriorTile, dwarfTile
} from '../constants'


export default class GameScene extends Phaser.Scene {
  private heroes: Hero[];
  private hero: Hero;
  private ownHeroType: string;
  private tiles: Tile[];
  private farmers: Farmer[];
  private hourTracker: HourTracker;
  private gameinstance: game;

  private cameraKeys;
  private cameraScrollSpeed = 15;
  private minZoom = 0.4;
  private maxZoom = 1;
  private zoomAmount = 0.01;

  constructor() {
    super({ key: 'Game' });
    this.heroes = Array<Hero>(4);
    this.tiles = Array<Tile>();
    this.farmers = new Array<Farmer>();
    this.ownHeroType = "dwarf";

  }

  public init(data) {
    console.log(data.heroType)
    this.gameinstance = data.controller;
    this.ownHeroType = data.heroType;
    this.sys.game.scene.bringToTop('BoardOverlay');
  }

  public preload() {
    this.load.image("farmer", "../assets/farmer.png");
    this.load.multiatlas('tiles', './assets/tilesheet.json', 'assets')
    // TODO: Create a sprite sheet for heroes as well so they don't need an 
    // internal sprite to render their image
  }

  public create() {
    this.cameraSetup();

    // Centered gameboard with border
    this.add.image(fullWidth / 2, fullHeight / 2, 'gameboard')
      .setDisplaySize(expandedWidth, expandedHeight);

    // Bring overlay scene to top
    this.sys.game.scene.bringToTop('BoardOverlay');

    this.setRegions();

    var self = this;
    this.gameinstance.getHeros((herotypes) => {
      herotypes.forEach(type => {
        if (type === "archer") {
          self.addHero("archer", archerTile, "archermale");
        } else if (type === "mage") {
          self.addHero("mage", mageTile, "magemale");
        } else if (type === "warrior") {
          self.addHero("warrior", warriorTile, "warriormale");
        } else if (type === "dwarf") {
          self.addHero("dwarf", dwarfTile, "dwarfmale");
        }
      });
    })

    this.addFarmers()
    // this.hourTrackerSetup();

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
        //tile.printstuff()
        self.moveRequest(tile, function () {
          console.log("callbackkk")
        })
      })
    })
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
        self.gameinstance.pickupFarmer(function () {
          farmer_0.destroy();
          //TODO: Add farmer to player inventory and display on player inventory card
        });
      }

    }, this);

    farmer_1.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == self.farmers[1].tile.id) {
        self.gameinstance.pickupFarmer(function () {
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

  private addHero(type: string, tileNumber: number, texture: string){
    const tile: Tile = this.tiles[tileNumber]
    let hero: Hero = new Hero(this, tile, texture).setDisplaySize(40, 60);
    this.heroes.push(hero);

    tile.hero = hero;
    tile.heroexist = true;
    this.add.existing(hero);
    if (this.ownHeroType === type) this.hero = hero;
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

  private moveRequest(tile, callback) {
    this.gameinstance.moveTo(tile, callback)
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