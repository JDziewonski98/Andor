import {Tile} from './tile';
import { Tilemaps } from 'phaser';

export default class GameScene extends Phaser.Scene {
  private weed: Phaser.GameObjects.Sprite;
  public tiles: Tile[] = [];

  constructor() {
    super({key: 'Game'});
  }
 
  public preload() {
  }

  public create() {
    this.add.image(500, 300, 'map');

    var id: number = 0;
    var numRows = 2;
    var numCols = 3;
    for (let i = 0; i < numCols; i++) { //num columns
      for (let j = 0; j < numRows; j++){ //num rows
        let rect: Tile = this.add.existing(new Tile(id++,this,300 + 175*i ,300 + 175*j, 150, 150, 0x000000)) as any;
        this.tiles.push(rect);
        rect.setInteractive();
        rect.on('pointerdown', function(pointer) {this.setFillStyle(0xff0000)});
        rect.on('pointerup', function(pointer) {this.setFillStyle(0x000000)});
        rect.on('pointerout', function(pointer) {this.setFillStyle(0x000000)});
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
    this.weed.on('pointerdown', function (pointer) {
        this.scene.start('Lobby');
    }, this);
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