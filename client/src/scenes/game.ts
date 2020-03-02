import { Tile } from '../objects/tile';
import { WindowManager } from "../utils/WindowManager";
import { Hero } from '../objects/hero';
import { HourTracker } from '../objects/hourTracker';
import * as io from "socket.io-client";
import { game } from '../api/game';
import {expandedWidth, expandedHeight, htX, htY, scaleFactor} from '../constants'

export default class GameScene extends Phaser.Scene {
  private hero: Hero;
  public tiles: Tile[] = [];
  private hourTracker: HourTracker;
  private gameinstance: game;

  private cameraKeys;
  private cameraScrollSpeed = 15;
  private minZoom = 0.4;
  private maxZoom = 1;
  private zoomAmount = 0.01;

  constructor() {
    super({ key: 'Game' });
  }

  public init(data) {
    this.gameinstance = data.gameinstance;
  }

  public preload() {
    // Loading the tiles sprite sheet for use of textures for Sprites
    this.load.multiatlas('tiles', './assets/tilesheet.json', 'assets')
    // TODO: Create a sprite sheet for heroes as well so they don't need an 
    // internal sprite to render their image
  }

  public create() {
    this.cameraSetup();

    this.add.image(expandedWidth/2, expandedHeight/2, 'gameboard')
                  .setDisplaySize(expandedWidth, expandedHeight);
    
    // Bring overlay scene to top
    this.sys.game.scene.bringToTop('BoardOverlay');

    // TODO: instantiate all tiles in GUI at start of game
    // Define JSON for this: each tile needs manual x,y set

    this.addMageMock();
    this.addDwarfMock();

    this.hourTrackerSetup();

    this.test()
  }

  private cameraSetup() {
    // Set bounds of camera to the limits of the gameboard
    var camera = this.cameras.main;
    camera.setBounds(0, 0, expandedWidth, expandedHeight);
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

  private addMageMock() {
    // Demo tile for mage - Tiles should have better encapsulation lol
    var tile9X = 1500*scaleFactor;
    var tile9Y = 250*scaleFactor;

    // Get the file name of the desired frame to pass as texture
    var treeTile = this.textures.get('tiles').getFrameNames()[12];
    var mageStartTile = new Tile(9, this, tile9X, tile9Y, treeTile);
    mageStartTile.setInteractive();
    this.add.existing(mageStartTile);

    var mageStartX = mageStartTile.heroCoords[0][0];
    var mageStartY = mageStartTile.heroCoords[0][1];
    var mageHero = this.add.sprite(mageStartX, mageStartY, 'magemale').setDisplaySize(40, 40);
    this.hero = new Hero(0, this, mageHero, 0, 0, mageStartTile);
    mageStartTile.hero = this.hero;
    mageStartTile.heroexist = true;

    mageHero.depth = 5;// What is this for?
    // Deprecated code, "return to lobby" should be moved into overlay or options scene
    mageHero.setInteractive();
    mageHero.on('pointerdown', function (pointer) {
      this.tiles = []
      WindowManager.destroy(this, 'chat');
      this.scene.start('Lobby');
    }, this);
  }

  private addDwarfMock() {
    // Demo tile for mage - Tiles should have better encapsulation lol
    var tile43X = 6460*scaleFactor;
    var tile43Y = 4360*scaleFactor;

    // Get the file name of the desired frame to pass as texture
    var treeTile = this.textures.get('tiles').getFrameNames()[12];
    var dwarfStartTile = new Tile(43, this, tile43X, tile43Y, treeTile);
    dwarfStartTile.setInteractive();
    this.add.existing(dwarfStartTile);

    var dwarfStartX = dwarfStartTile.heroCoords[1][0];
    var dwarfStartY = dwarfStartTile.heroCoords[1][1];
    var dwarfHero = this.add.sprite(dwarfStartX, dwarfStartY, 'dwarfmale').setDisplaySize(40, 40);
    this.hero = new Hero(0, this, dwarfHero, 0, 0, dwarfStartTile);
    dwarfStartTile.hero = this.hero;
    dwarfStartTile.heroexist = true;

    dwarfHero.depth = 5;// What is this for?
  }

  private hourTrackerSetup() {
    // Creating the hour tracker
    var htx = htX;
    var hty = htY;
    var mageHtIcon = this.add.sprite(htx, hty, 'magemale').setDisplaySize(40, 40);
    var dwarfHtIcon = this.add.sprite(htx, hty, 'dwarfmale').setDisplaySize(40, 40);
    this.hourTracker = new HourTracker(this, htx, hty, [mageHtIcon, dwarfHtIcon], this.hero);
    // Hero ids are hardcoded for now, need to be linked to game setup
    mageHtIcon.x = this.hourTracker.heroCoords[0][0];
    mageHtIcon.y = this.hourTracker.heroCoords[0][1];
    dwarfHtIcon.x = this.hourTracker.heroCoords[1][0];
    dwarfHtIcon.y = this.hourTracker.heroCoords[1][1];
    // we're not actually adding the hourTracker, we're adding it's internal sprite
    this.hourTracker.depth = 5;
    this.hourTracker.depth = 0;
    this.hero.hourTracker = this.hourTracker;
    this.hourTracker.setInteractive();
  }

  private escChat(){
    WindowManager.destroy(this, 'chat');
  }

  private test() {
    var socket = io.connect("http://localhost:3000/game");
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
    if (this.cameraKeys["zoomIn"].isDown && camera.zoom<this.maxZoom) {
      camera.zoom += this.zoomAmount;
    } else if (this.cameraKeys["zoomOut"].isDown && camera.zoom>this.minZoom) {
      camera.zoom -= this.zoomAmount;
    }
  }

}