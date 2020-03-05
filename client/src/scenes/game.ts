import { Tile } from '../objects/tile';
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
  public tiles: Tile[];
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

    //this.addMageMock();
    //this.addDwarfMock();

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
    // // Get the file name of the desired frame to pass as texture
    // var treeTile = this.textures.get('tiles').getFrameNames()[12];
    // var mageStartTile = new Tile(9, this, tile9X, tile9Y, treeTile);
    // mageStartTile.setInteractive();
    // this.add.existing(mageStartTile);
  }

  private addMageMock() {
    // Demo tile for mage - Tiles should have better encapsulation lol
    var tile9X = this.tiles[9].x * scaleFactor + borderWidth;
    var tile9Y = this.tiles[9].y * scaleFactor + borderWidth;
    console.log("mage", tile9X, tile9Y)

    // Get the file name of the desired frame to pass as texture
    var treeTile = this.textures.get('tiles').getFrameNames()[12];
    var mageStartTile = new Tile(9, this, tile9X, tile9Y, treeTile);
    mageStartTile.setInteractive();
    this.add.existing(mageStartTile);

    var mageStartX = mageStartTile.heroCoords[0][0];
    var mageStartY = mageStartTile.heroCoords[0][1];
    var mageHero = this.add.sprite(mageStartX, mageStartY, 'magemale').setDisplaySize(40, 40);
    this.heroes.push(new Hero(0, this, mageHero, 0, 0, mageStartTile));
    mageStartTile.hero = this.heroes[0];
    mageStartTile.heroexist = true;

    // Add adjacent tile for mock movement
    var tile8X = 2010 * scaleFactor + borderWidth;
    var tile8Y = 820 * scaleFactor + borderWidth;
    var mageAdjTile = new Tile(8, this, tile8X, tile8Y, treeTile);
    mageAdjTile.adjRegionsIds.push(mageStartTile.id);
    mageStartTile.adjRegionsIds.push(mageAdjTile.id);
    mageAdjTile.setInteractive();
    this.add.existing(mageAdjTile);

    mageHero.depth = 5;// What is this for?
    // Deprecated code, "return to lobby" should be moved into overlay or options scene
    // mageHero.setInteractive();
    // mageHero.on('pointerdown', function (pointer) {
    //   this.tiles = []
    //   WindowManager.destroy(this, 'chat');
    //   this.scene.start('Lobby');
    // }, this);
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