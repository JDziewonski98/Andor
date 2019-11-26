import {Tile} from './tile';
import { Tilemaps } from 'phaser';

// const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
//   active: false,
//   visible: false,
//   key: 'Game',
// };

export default class GameScene extends Phaser.Scene {
  private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
//   private weed: Phaser.GameObjects.Sprite & { body: Phaser.Physics.Arcade.Sprite };
  public tiles: Tile[] = [];

  constructor() {
    super({key: 'Game'});
  }
 
  public preload() {
    this.load.image('map','./assets/andor_map.jpg');
    this.load.spritesheet('weed', './assets/icons/Background 3b.png',
    {frameWidth: 32, frameHeight: 32})
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
        rect.on('pointerdown', function(pointer) {this.printstuff()});
      }
    }
    this.setTileAdjacencies(this.tiles, numRows, numCols);

    // this.weed = this.add.sprite(500, 300, 'weed').setInteractive();

    this.square = this.add.rectangle(400, 400, 100, 100, 0xFFFF00) as any;
    // this.square.createBitmapMask(this.weed);
    this.physics.add.existing(this.square);
    this.square.setInteractive();
    this.square.on('pointerdown', function (pointer) {
        this.scene.start('Lobby');
    }, this);
  }

  public setTileAdjacencies(tiles: Tile[], rows: number, cols: number) {
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].adjacent.push(tiles[i-1])
        tiles[i].adjacent.push(tiles[i+1])
        tiles[i].adjacent.push(tiles[i-rows])
        tiles[i].adjacent.push(tiles[i+rows])
    }
  }


  public update() {
    const cursorKeys = this.input.keyboard.createCursorKeys();
 
    if (cursorKeys.up.isDown) {
      this.square.body.setVelocityY(-1000);
    } else if (cursorKeys.down.isDown) {
      this.square.body.setVelocityY(600);
    } else {
        while (this.square.body.velocity.y != 0){
          if (this.square.body.velocity.y > 0) {
            this.square.body.setVelocityY(this.square.body.velocity.y - 1);
          }
          else {
            this.square.body.setVelocityY(this.square.body.velocity.y + 1);
          }
        }
    }
    if (cursorKeys.right.isDown) {
      this.square.body.setVelocityX(500);
    } else if (cursorKeys.left.isDown) {
      this.square.body.setVelocityX(-500);
    } else {
      this.square.body.setVelocityX(0);
    }
  }
}