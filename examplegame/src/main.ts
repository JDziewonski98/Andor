import * as Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };
  private button;
  private clickcount: number = 0;
  public clickcounttext;
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
    this.clickcounttext = this.add.text(100,200,'');
    this.button = this.add.image(400,300,'button').setInteractive().on('pointerdown', () => { this.updateclick(++this.clickcount) });
    //this.add.button(window.innerWidth/2, window.innerHeight/2,);
    this.updateclick(this.clickcount);
  }

  public updateclick(clickcount: number) {
    this.clickcounttext.setText("big dawg: " + clickcount + " clicks to date");
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
        //this.square.body.setVelocityY(0);
      //this.square.body.setVelocityY(0);
    }
    
    if (cursorKeys.right.isDown) {
      this.square.body.setVelocityX(500);
    } else if (cursorKeys.left.isDown) {
      this.square.body.setVelocityX(-500);
    } else {
      this.square.body.setVelocityX(0);
    }
  }

  public wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

}

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',
 
  type: Phaser.AUTO,
 
  width: window.innerWidth,
  height: window.innerHeight,
 
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
 
  parent: 'game',
  backgroundColor: '#000000',
  scene:  GameScene,
};
 
export const game = new Phaser.Game(gameConfig);