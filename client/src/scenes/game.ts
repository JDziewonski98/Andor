import { Tile } from '../objects/tile';
import { WindowManager } from "../utils/WindowManager";
import { Hero } from '../objects/hero';
import { HourTracker } from '../objects/hourTracker';
import * as io from "socket.io-client";
import { game } from '../api/game';
import {expandedWidth, expandedHeight, htX, htY, scaleFactor} from '../constants'

export default class GameScene extends Phaser.Scene {
  // private weed: Phaser.GameObjects.Sprite;
  // private mageHero: Phaser.GameObjects.Sprite;
  private hero: Hero;
  public tiles: Tile[] = [];
  private hourTracker: HourTracker;
  private gameinstance: game;

  private upKey; 
  private downKey; 
  private leftKey;
  private rightKey;

  private cameraScrollSpeed = 15;

  constructor() {
    super({ key: 'Game' });
  }

  public init(data) {
    this.gameinstance = data.gameinstance;
  }

  public preload() {
    // Loading the tiles sprite sheet for use of textures for Sprites
    this.load.multiatlas('tiles', './assets/tilesheet.json', 'assets')
    // Create a sprite sheet for heroes as well so they don't need an 
    // internal sprite to render their image
  }

  public create() {
    this.cameraSetup();
    this.add.image(expandedWidth/2, expandedHeight/2, 'gameboard')
                  .setDisplaySize(expandedWidth, expandedHeight);
    
    // Bring overlay scene to top
    this.sys.game.scene.bringToTop('BoardOverlay');

    // Need to instantiate all tiles in GUI at start of game

    this.addMageMock();
    this.addDwarfMock();

    // Creating the hour tracker
    var htx = htX;
    var hty = htY;
    console.log(htx, ", ", hty);
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

    this.test()
  }

  private cameraSetup() {
    // Set bounds of camera to the limits of the gameboard
    var camera = this.cameras.main;
    camera.setBounds(0, 0, expandedWidth, expandedHeight);
    // Set keys for scrolling
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  }

  private addMageMock() {
    // Demo tile for mage - Tiles should have better encapsulation lol
    var tile9X = 1500*scaleFactor;
    var tile9Y = 250*scaleFactor;

    // Get the file name of the desired frame to pass as texture
    var treeTile = this.textures.get('tiles').getFrameNames()[12];
    var mageStartTile = new Tile(9, this, tile9X, tile9Y, treeTile);
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
    this.add.existing(dwarfStartTile);

    var dwarfStartX = dwarfStartTile.heroCoords[1][0];
    var dwarfStartY = dwarfStartTile.heroCoords[1][1];
    var dwarfHero = this.add.sprite(dwarfStartX, dwarfStartY, 'dwarfmale').setDisplaySize(40, 40);
    this.hero = new Hero(0, this, dwarfHero, 0, 0, dwarfStartTile);
    dwarfStartTile.hero = this.hero;
    dwarfStartTile.heroexist = true;

    dwarfHero.depth = 5;// What is this for?
  }

  private escChat(){
    WindowManager.destroy(this, 'chat');
  }

  private test() {
    var socket = io.connect("http://localhost:3000/game");
  }

  //leetcode hard algorithm
  public setTileAdjacencies(tiles: Tile[], rows: number, cols: number) {
    for (let i = 0; i < tiles.length; i++) {
      //left
      if (tiles[i].id % cols != 0) { tiles[i].adjacent.push(tiles[i - rows]) }
      //right
      if (tiles[i].id % cols != cols - 1) { tiles[i].adjacent.push(tiles[i + rows]) }
      //down
      if (tiles[i].id < ((cols * rows) - 1)) { tiles[i].adjacent.push(tiles[i + 1]) }
      //up
      if (tiles[i].id >= cols) { tiles[i].adjacent.push(tiles[i - 1]) }
    }
  }

  public update() {
    var camera = this.cameras.main;

    if (this.upKey.isDown) {
        camera.scrollY -= this.cameraScrollSpeed;
    } else if (this.downKey.isDown) {
        camera.scrollY += this.cameraScrollSpeed;
    }

    if (this.leftKey.isDown) {
        camera.scrollX -= this.cameraScrollSpeed;
    } else if (this.rightKey.isDown) {
        camera.scrollX += this.cameraScrollSpeed;
    }
  }

}