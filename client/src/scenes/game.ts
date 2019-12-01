import {Tile} from '../objects/tile';
import { Tilemaps } from 'phaser';
import { Chat } from './chatwindow';
import { HeroWindow } from './herowindow';
import { WindowManager } from "../utils/WindowManager";

export default class GameScene extends Phaser.Scene {
  private weed: Phaser.GameObjects.Sprite;
  public tiles: Tile[] = [];
  private count: number = 0;
  private gameText;
  private hours;

  constructor() {
    super({key: 'Game'});
  }
 
  public preload() {
    this.load.multiatlas('tiles','./assets/tilesheet.json','assets')
  }

  public create() {
    //i thought the andor board background was kind of messy
    //this.add.image(500, 300, 'map');
    this.add.image(500,300,'andordude').setDisplaySize(1000,600)
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
      for (let j = 0; j < numRows; j++){ //num rows
        var atlastextures = this.textures.get('tiles')
        var tiles = atlastextures.getFrameNames()
        //we can now reference each tile image by index
        //Tile new extends sprite so we can pass a image to use for it.
        let rect: Tile = this.add.existing(new Tile(id++,this,300 + 75*i ,200 + 75*j, tiles[tilelogic(i,j)])) as any;
        this.tiles.push(rect);
        rect.setInteractive();
        rect.on('pointerdown', function(pointer) {this.printstuff()});
        rect.on('pointerdown', function(pointer) {this.moveTo()})
      }
    }
    this.setTileAdjacencies(this.tiles, numRows, numCols);

    this.weed = this.add.sprite(this.tiles[0].x,this.tiles[0].y,'weed');
    this.weed.depth = 5;
    this.tiles[0].hero = this.weed;
    this.tiles[0].heroexist = true;

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
    
    // WindowManager.create(this, 'heroOwn', HeroWindow);
    this.gameText = this.add.text(400,10,"You: 5g / 3 str / 8 will",style2)
    this.gameText.setInteractive();
    this.gameText.on('pointerup', function (pointer) {
      
    }, this);

    WindowManager.create(this,'chat', Chat);
    this.gameText = this.add.text(800,550,"CHAT", style2).setOrigin(0.5)
    this.gameText.setInteractive();
    this.gameText.on('pointerdown', function (pointer) {
      WindowManager.toggle(this, 'chat');
    }, this); 

  //this.input.keyboard.on('keydown_A',this.killwindows,this)


  }

  //leetcode hard algorithm
  public setTileAdjacencies(tiles: Tile[], rows: number, cols: number) {
    for (let i = 0; i < tiles.length; i++) {
        if (i % rows != 0){tiles[i].adjacent.push(tiles[i-1])}
        if (i % rows != rows - 1){tiles[i].adjacent.push(tiles[i+1])}
        tiles[i].adjacent.push(tiles[i-rows])
        tiles[i].adjacent.push(tiles[i+rows])
    }
  }


  public update() {
  }

}