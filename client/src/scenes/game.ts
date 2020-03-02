import { Tile } from '../objects/tile';
import { WindowManager } from "../utils/WindowManager";
import { Hero } from '../objects/hero';
import { HourTracker } from '../objects/hourTracker';
import * as io from "socket.io-client";
import { game } from '../api/game';

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

  private constants = require('../constants');

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
    // Set bounds of camera to the limits of the gameboard
    var camera = this.cameras.main;
    var gameW = this.constants.expandedWidth;
    var gameH = this.constants.expandedHeight;
    console.log(gameW, gameH);
    camera.setBounds(0, 0, gameW, gameH);
    // Set keys for scrolling
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    this.add.image(gameW/2, gameH/2, 'gameboard').setDisplaySize(gameW, gameH)
    
    // Bring overlay scene to top
    this.sys.game.scene.bringToTop('BoardOverlay')

    var id: number = 0;

    // temporary lambda function to load a few different tile icons when making tiles
    let tilelogic = (i: number, j: number) => {
      if (i == 0 && j == 0) {
        return 61
      }
      if (j == 3) {
        return 3
      }
      return 0
    }

    // var numRows = 5;
    // var numCols = 6;
    // for (let i = 0; i < numCols; i++) { //num columns
    //   id = i;
    //   for (let j = 0; j < numRows; j++) { //num rows
        // var atlastextures = this.textures.get('tiles')
        // var tiles = atlastextures.getFrameNames()
    //     //we can now reference each tile image by index
    //     //Tile new extends sprite so we can pass a image to use for it.
    //     let rect: Tile = this.add.existing(new Tile(id, this, 300 + 75 * i, 200 + 75 * j, tiles[tilelogic(i, j)])) as any;
    //     id += numCols;
    //     this.tiles.push(rect);
    //     rect.setInteractive();
    //   }
    // }
    
    // this.setTileAdjacencies(this.tiles, numRows, numCols);

    // Demo tile - Tiles should have better encapsulation lol
    // Get the file name of the desired frame to pass as texture
    
    var tile9X = 1500*this.constants.scaleFactor;
    var tile9Y = 250*this.constants.scaleFactor;

    var treeTile = this.textures.get('tiles').getFrameNames()[12];
    var startTile = new Tile(9, this, tile9X, tile9Y, treeTile);
    this.add.existing(startTile);

    var mageStartX = startTile.heroCoords[1][0];
    var mageStartY = startTile.heroCoords[1][1];

    var mageHero = this.add.sprite(mageStartX, mageStartY, 'magemale').setDisplaySize(40, 40);
    this.hero = new Hero(0, this, mageHero, 0, 0, startTile);
    startTile.hero = this.hero;
    startTile.heroexist = true;

    var htx = this.constants.htX;
    var hty = this.constants.htY;
    console.log(htx, ", ", hty);
    var mageHtIcon = this.add.sprite(htx, hty, 'magemale').setDisplaySize(40, 40);
    this.hourTracker = new HourTracker(this, htx, hty, mageHtIcon, this.hero);

    this.hourTracker.depth = 5;
    this.hourTracker.depth = 0;
    this.hero.hourTracker = this.hourTracker;
    this.hourTracker.setInteractive();

    // What is this for?
    mageHero.depth = 5;

    // Deprecated code, "return to lobby" should be moved into overlay or options scene
    mageHero.setInteractive();
    mageHero.on('pointerdown', function (pointer) {
      this.tiles = []
      WindowManager.destroy(this, 'chat');
      this.scene.start('Lobby');
    }, this);

    this.test()
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