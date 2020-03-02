import * as Phaser from 'phaser';
import Scenes from './scenes/';
import {fullWidth, fullHeight} from './constants'

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',
 
  type: Phaser.AUTO,
 
  width: fullWidth,
  height: fullHeight,
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