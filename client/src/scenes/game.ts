import { Tile } from '../objects/tile';
import { WindowManager } from "../utils/WindowManager";
import { Hero } from '../objects/hero';
import { HourTracker } from '../objects/hourTracker';
import * as io from "socket.io-client";
import { game } from '../api/game';
import {expandedWidth, expandedHeight, htX, htY} from '../constants'

export default class GameScene extends Phaser.Scene {
  private weed: Phaser.GameObjects.Sprite;
  private hero: Hero;
  public tiles: Tile[] = [];
  private hourTracker: HourTracker;
  private gameinstance: game;

  private cameraKeys;
  private cameraScrollSpeed = 15;
  private minZoom = 0.5;
  private maxZoom = 1;
  private zoomAmount = 0.01;

  constructor() {
    super({ key: 'Game' });
  }

  public init(data) {
    this.gameinstance = data.gameinstance;
  }

  public preload() {
    this.load.multiatlas('tiles', './assets/tilesheet.json', 'assets')
  }

  public create() {
    // Set bounds of camera to the limits of the gameboard
    var camera = this.cameras.main;
    var gameW = expandedWidth;
    var gameH = expandedHeight;
    console.log(gameW, gameH);
    camera.setBounds(0, 0, gameW, gameH);
    // Set keys for scrolling and zooming
    this.cameraKeys = this.input.keyboard.addKeys({
        up: 'up',
        down: 'down',
        left: 'left',
        right: 'right',
        zoomIn: 'plus',
        zoomOut: 'minus'
    });

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

    var numRows = 5;
    var numCols = 6;
    for (let i = 0; i < numCols; i++) { //num columns
      id = i;
      for (let j = 0; j < numRows; j++) { //num rows
        var atlastextures = this.textures.get('tiles')
        var tiles = atlastextures.getFrameNames()
        //we can now reference each tile image by index
        //Tile new extends sprite so we can pass a image to use for it.
        let rect: Tile = this.add.existing(new Tile(id, this, 300 + 75 * i, 200 + 75 * j, tiles[tilelogic(i, j)])) as any;
        id += numCols;
        this.tiles.push(rect);
        rect.setInteractive();
      }
    }
    
    this.setTileAdjacencies(this.tiles, numRows, numCols);
    this.weed = this.add.sprite(this.tiles[0].x, this.tiles[0].y, 'weed');
    this.hero = new Hero(0, this, this.weed, 0, 0, tiles[0]);
    this.tiles[0].hero = this.hero;
    this.tiles[0].heroexist = true;

    var htx = htX;
    var hty = htY;
    console.log(htx, ", ", hty);
    this.hourTracker = new HourTracker(this, htx, hty, 
        this.add.sprite(htx, hty, 'weed').setDisplaySize(40, 40), this.hero);
    this.hourTracker.depth = 5;
    this.hourTracker.depth = 0;
    this.hero.hourTracker = this.hourTracker;
    this.hourTracker.setInteractive();

    this.weed.depth = 5;

    this.weed.setInteractive();
    this.weed.on('pointerdown', function (pointer) {
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