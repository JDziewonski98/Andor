import { Tile } from '../objects/tile';
import { Tilemaps } from 'phaser';
import { Chat } from './chatwindow';
import { HeroWindow } from './herowindow';
import { WindowManager } from "../utils/WindowManager";
import { Hero } from '../objects/hero';
import { HourTracker } from '../objects/hourTracker';
import * as io from "socket.io-client";
import { game } from '../api/game';


export default class GameScene extends Phaser.Scene {
  private weed: Phaser.GameObjects.Sprite;
  private hourBar;
  private hero: Hero;
  public tiles: Tile[] = [];
  private count: number = 0;
  private gameText;
  private windows: Window[] = [];
  private hourTracker: HourTracker;
  private gameinstance: game;

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

    var self = this;

    this.add.image(500, 300, 'andordude').setDisplaySize(1000, 600)
    this.add.image(800, 40, 'hourbar').setDisplaySize(400, 75);
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

    this.hourTracker = new HourTracker(this, 625, 40, this.add.sprite(625, 40, 'weed').setDisplaySize(40, 40), this.hero);
    this.hourTracker.depth = 5;
    this.hourTracker.depth = 0;
    this.hero.hourTracker = this.hourTracker;
    this.hourTracker.setInteractive();

    this.weed.depth = 5;


    this.weed.setInteractive();
    // TODO Important!!!! gotta find a way to clear data when u exit a scene or else problems happen
    this.weed.on('pointerdown', function (pointer) {
      console.log(this.tiles.length)
      this.tiles = []
      WindowManager.destroy(this, 'chat');
      this.scene.start('Lobby');
    }, this);

    var style2 = {
      fontFamily: '"Roboto Condensed"',
      fontSize: "20px",
      backgroundColor: '#f00'
    }

    // Your profile.
    this.gameText = this.add.text(400, 10, "You: 5g / 3 str / 8 will", style2)
    this.gameText.setInteractive();
    this.gameText.on('pointerdown', function (pointer) {
      if(this.scene.isVisible('heroCard')){
        WindowManager.destroy(this, 'heroCard');
      } else {
        WindowManager.create(this, 'heroCard', HeroWindow, 'weed');
        let window = WindowManager.get(this, 'heroCard')
        window.setName('You!!')
      }
    }, this);

    //Other player's icons.
    this.gameText = this.add.text(360, 10, "P2", style2)
    this.gameText.setInteractive();
    this.gameText.on('pointerdown', function (pointer) {
      if(this.scene.isVisible('heroCard2')){
        WindowManager.destroy(this, 'heroCard2');
      } else {
        WindowManager.create(this, 'heroCard2', HeroWindow, 'playbutton');
        let window = WindowManager.get(this, 'heroCard2')
        window.setName('Player 2')
      }
    }, this);

    this.gameText = this.add.text(330, 10, "P3", style2)
    this.gameText.setInteractive();
    this.gameText.on('pointerdown', function (pointer) {
      if(this.scene.isVisible('heroCard3')){
        WindowManager.destroy(this, 'heroCard3');
      } else {
        WindowManager.create(this, 'heroCard3', HeroWindow, 'playbutton');
        let window = WindowManager.get(this, 'heroCard3')
        window.setName('Player 3')
      }
    }, this);

    this.gameText = this.add.text(300, 10, "P4", style2)
    this.gameText.setInteractive();
    this.gameText.on('pointerdown', function (pointer) {
      if(this.scene.isVisible('heroCard4')){
        WindowManager.destroy(this, 'heroCard4');
      } else {
        WindowManager.create(this, 'heroCard4', HeroWindow, 'playbutton');
        let window = WindowManager.get(this, 'heroCard4')
        window.setName('Player 4')
      }
    }, this);

    //Options
    var optionsIcon = this.add.image(30, 30, 'optionsIcon').setInteractive();
    optionsIcon.setScale(0.5)
    optionsIcon.on('pointerdown', function (pointer) {
        this.sys.game.scene.bringToTop('Options')
        this.sys.game.scene.getScene('Options').scene.setVisible(true, 'Options')
        this.sys.game.scene.resume('Options')
    }, this);

    // chat window
    this.gameText = this.add.text(800,550,"CHAT", style2).setOrigin(0.5)
    this.gameText.setInteractive();
    this.gameText.on('pointerdown', function (pointer) {
      // TODO clean this up.
      if(this.scene.isVisible('chat')){
        WindowManager.destroy(this, 'chat');
      } else {
        WindowManager.create(this, 'chat', Chat, null, self.gameinstance);
      }
      
    }, this); 

    this.input.keyboard.on('keydown_ESC', this.escChat,this)

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
  }

}