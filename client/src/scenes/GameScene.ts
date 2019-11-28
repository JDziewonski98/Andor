import {Tile} from '../objects/tile';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export default class GameScene extends Phaser.Scene {
    private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
    public tiles: Tile[] = [];
    constructor() {
      super(sceneConfig);
    }
   
    public preload() {
      this.load.image('beach','./assets/sample.jpg');
      this.load.spritesheet('button','./assets/icons/Background 3b.png',{ frameWidth: 32, frameHeight: 32 })
    }
  
    public create() {
      this.add.image(window.innerWidth/2, window.innerHeight/2, 'beach');
      this.square = this.add.rectangle(400, 400, 100, 100, 0xFFFFFF) as any;
      this.physics.add.existing(this.square);
  
      var id: number = 0;
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++){
          let rect: Tile = this.add.existing(new Tile(id++,this,300 + 175*i ,300 + 175*j,150,150,0x000000)) as any;
          this.tiles.push(rect);
          rect.setInteractive();
          rect.on('pointerdown', function(pointer) {this.setFillStyle(0xff0000)});
          rect.on('pointerup', function(pointer) {this.setFillStyle(0x000000)});
          rect.on('pointerdown', function(pointer) {this.printstuff()});
        }
      }
      this.setTileAdjacencies(this.tiles,4,6);
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