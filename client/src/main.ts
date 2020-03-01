import * as Phaser from 'phaser';
import Scenes from './scenes/';

// Size of game is based on size of gameboard jpg
export var expandedWidth = 9861*.15;
export var expandedHeight = 6476*.15;

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',
 
  type: Phaser.AUTO,
 
  width: expandedWidth,
  height: expandedHeight,
  dom:{
    createContainer: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
 
  parent: 'game',
  backgroundColor: '#000000',
  scene: Scenes,

  scale : {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};
 
export const game = new Phaser.Game(gameConfig);