import {Tile} from '../objects/tile';
import { Tilemaps } from 'phaser';
import {Window} from './window'

export default class GameScene extends Phaser.Scene {
  private weed: Phaser.GameObjects.Sprite;
  public tiles: Tile[] = [];
  private count: number = 0;
  private gameText;
  private windows:Window[] = []
  private hours;

  constructor() {
    super({key: 'Game'});
  }
 
  public preload() {
    this.load.multiatlas('tiles','./assets/tilesheet.json','assets')
  }

  public create() {
    this.add.image(500, 300, 'map');
    var id: number = 0;

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
        //let image = this.tilegraphics.get('tiles').getFrameNames()
        let rect: Tile = this.add.existing(new Tile(id++,this,300 + 75*i ,200 + 75*j, tiles[tilelogic(i,j)])) as any;
        this.tiles.push(rect);
        rect.setInteractive();
        //rect.on('pointerdown', function(pointer) {this.setFillStyle(0xff0000)});
        //rect.on('pointerup', function(pointer) {this.setFillStyle(0x000000)});
        //rect.on('pointerout', function(pointer) {this.setFillStyle(0x000000)});
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
    // TODO Important!!!! gotta find a way to clear data when u exit a scene or else shit gets fricked
    this.weed.on('pointerdown', function (pointer) {
      console.log(this.tiles.length)
      this.windows.forEach(element => {
        element.kill()
      });
      this.windows = []
      this.tiles = []
        this.scene.start('Lobby');
    }, this);

    var style2 = { 
      fontFamily: '"Roboto Condensed"',
      fontSize: "20px",
      backgroundColor: '#f00'
    }
    this.gameText = this.add.text(400,10,"You: 5g / 3 str / 8 will",style2)
    this.gameText.setInteractive();
    this.gameText.on('pointerup', function (pointer) {


    this.createWindow(200,200,'herowindow');

  }, this);




  }


  public createWindow (width,height,funct)
  {
      var x = Phaser.Math.Between(400, 600);
      var y = Phaser.Math.Between(64, 128);

      var handle = 'window' + this.count++;

      var win = this.add.zone(x, y, width, height).setInteractive();

      var demo = new Window(handle, win,funct);

      this.input.setDraggable(win);

      win.on('drag', function (pointer, dragX, dragY) {

          this.x = dragX;
          this.y = dragY;

          demo.refresh()

      });

      this.scene.add(handle, demo, true);
      this.windows.push(demo)
  }




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