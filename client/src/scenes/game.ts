import { Tile } from '../objects/tile';
import { Farmer } from '../objects/farmer';
import { WindowManager } from "../utils/WindowManager";
import { Hero } from '../objects/hero';
import { HourTracker } from '../objects/hourTracker';
import { game } from '../api';
import {
  expandedWidth, expandedHeight, borderWidth,
  fullWidth, fullHeight, htX, htY, scaleFactor
} from '../constants'


export default class GameScene extends Phaser.Scene {
  private heroes: Hero[];
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
    this.heroes = Array<Hero>();
    this.tiles = Array<Tile>();
    this.farmers = new Array<Farmer>();
  }

  public init(data) {
    this.gameinstance = data.controller;
  }

  public preload() {
    // Loading the tiles sprite sheet for use of textures for Sprites
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

    //this.addDwarfMock();
    //this.addMageMock();
    // this.addFarmerMock()
    this.hourTrackerSetup();

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
    // console.log("regions sanity check:", data);
    // console.log(data.type);
    var treeTile = this.textures.get('tiles').getFrameNames()[12];
    for (var element in tilesData) {
      var tile = new Tile(element, this, tilesData[element].xcoord * scaleFactor + borderWidth, tilesData[element].ycoord * scaleFactor + borderWidth, treeTile);
      this.tiles[element] = tile;
      tile.setInteractive();
      this.add.existing(tile);
      //  console.log(element, data[element].xcoord, data[element].ycoord, treeTile);
      //  this.tiles[element.id] = new tile()
    }

    /// for movement callback, ties pointerdown to move request
    var that = this
    this.tiles.map(function(tile){
      tile.on('pointerdown', function(){
        //tile.printstuff()
        that.moveRequest(tile, function(){
          console.log("callbackkk")
        })
      })
    })
    // // Get the file name of the desired frame to pass as texture
    // var treeTile = this.textures.get('tiles').getFrameNames()[12];
    // var mageStartTile = new Tile(9, this, tile9X, tile9Y, treeTile);
    // mageStartTile.setInteractive();
    // this.add.existing(mageStartTile);
  }

  private addFarmerMock(){
    // Demo tile for farmer 1 
    var tile24X = 100*scaleFactor+borderWidth;
    var tile24Y = 4150*scaleFactor+borderWidth;

    // Demo tile for farmer 1 
    var tile36X = 3600*scaleFactor+borderWidth;
    var tile36Y = 3500*scaleFactor+borderWidth;

    // Get the file name of the desired frame to pass as texture
    var treeTile = this.textures.get('tiles').getFrameNames()[12];
    var farmerOneStartTile = new Tile(24, this, tile24X, tile24Y, treeTile);
    var farmerTwoStartTile = new Tile(36, this, tile36X, tile36Y, treeTile);

    farmerOneStartTile.setInteractive();
    this.add.existing(farmerOneStartTile);
    farmerTwoStartTile.setInteractive();
    this.add.existing(farmerTwoStartTile);

    var farmerOneStartX = farmerOneStartTile.farmerCoords[1][0];
    var farmerOneStartY = farmerOneStartTile.farmerCoords[1][1];
    var farmerTwoStartX = farmerTwoStartTile.farmerCoords[1][0];
    var farmerTwoStartY = farmerTwoStartTile.farmerCoords[1][1];

    var farmerOne = this.add.sprite(farmerOneStartX, farmerOneStartY, 'dwarfmale').setDisplaySize(40, 40);
    var farmerTwo = this.add.sprite(farmerTwoStartX, farmerTwoStartY, 'dwarfmale').setDisplaySize(40, 40);

    farmerOne.setInteractive();
    farmerTwo.setInteractive();
    

    this.farmers.push(new Farmer(this, farmerOne, 0, 0, farmerOneStartTile));
    this.farmers.push(new Farmer(this, farmerTwo, 0, 0, farmerTwoStartTile));

    farmerOneStartTile.farmer.push(this.farmers[0]);
    farmerOneStartTile.farmerexist = true;
    farmerTwoStartTile.farmer.push(this.farmers[1]);
    farmerTwoStartTile.farmerexist = true;

    var self = this;

    farmerOne.on('pointerdown', function (pointer) {
      console.log(self.farmers[0].tile.id)
      console.log(this.hero.tile.id)
      if(self.heroes[0].tile.id == self.farmers[0].tile.id){
        self.gameinstance.pickupFarmer(self.heroes[0].id, function(){
          farmerOne.destroy();
          //TODO: Add farmer to player inventory and display on player inventory card
        });
      }

    }, this);

    farmerTwo.on('pointerdown', function (pointer) {
      if(self.heroes[0].tile.id == self.farmers[1].tile.id){
        self.gameinstance.pickupFarmer(self.heroes[0].id, function(){
          farmerTwo.destroy();
        });
      }

    }, this);

    
    this.gameinstance.updateFarmer(function(){
      farmerOne.destroy();
    });

    this.gameinstance.updateFarmer(function(){
      farmerTwo.destroy();
    });
  }

  private addDwarfMock() {
    // Demo tile for dwarf - Tiles should have better encapsulation lol
    var tile43X = this.tiles[43].x * scaleFactor + borderWidth;
    var tile43Y = this.tiles[43].y * scaleFactor + borderWidth;

    // Get the file name of the desired frame to pass as texture
    var treeTile = this.textures.get('tiles').getFrameNames()[12];
    var dwarfStartTile = new Tile(43, this, tile43X, tile43Y, treeTile);
    dwarfStartTile.setInteractive();
    this.add.existing(dwarfStartTile);

    var dwarfStartX = dwarfStartTile.heroCoords[1][0];
    var dwarfStartY = dwarfStartTile.heroCoords[1][1];
    var dwarfHero = this.add.sprite(dwarfStartX, dwarfStartY, 'dwarfmale').setDisplaySize(40, 40);
    this.heroes.push(new Hero(1, this, dwarfHero, 0, 0, dwarfStartTile));
    dwarfStartTile.hero = this.heroes[1];
    dwarfStartTile.heroexist = true;

    // Add adjacent tile for mock movement
    var tile39X = 5640 * scaleFactor + borderWidth;
    var tile39Y = 4370 * scaleFactor + borderWidth;
    var dwarfAdjTile = new Tile(39, this, tile39X, tile39Y, treeTile);
    dwarfAdjTile.adjacent.push(dwarfStartTile);
    dwarfStartTile.adjacent.push(dwarfAdjTile);
    dwarfAdjTile.setInteractive();
    this.add.existing(dwarfAdjTile);

    dwarfHero.depth = 5;// What is this for?
  }
  
  private addMageMock() {
  }
  private addArcherMock() {
  }
  private addWarriorMock() {
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
    var h;
    for (h of this.heroes) {
      h.hourTracker = this.hourTracker;
    }

    this.hourTracker.setInteractive();
  }

  private escChat() {
    WindowManager.destroy(this, 'chat');
  }
  private moveRequest(tile, callback){
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