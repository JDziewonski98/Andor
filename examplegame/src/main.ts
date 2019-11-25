import * as Phaser from 'phaser';
import GameScene from './game';
import WeedScene from './weed';
import LobbyScene from './lobby';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',
 
  type: Phaser.AUTO,
 
  width: 1000,
  height: 600,
 
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
 
  parent: 'game',
  backgroundColor: '#000000',
  scene:  [
    LobbyScene,
    WeedScene,
    GameScene
  ]
};
 
export const game = new Phaser.Game(gameConfig);