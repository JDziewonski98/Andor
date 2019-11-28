import * as Phaser from 'phaser';
import GameScene from './game';
import WeedScene from './weed';
import LobbyScene from './lobby';
import CreateGameScene from './creategame';
import JoinGameScene from './joingame';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Sample',
 
  type: Phaser.AUTO,
 
  width: 1000,
  height: 600,
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
  scene:  [
    LobbyScene,
    WeedScene,
    GameScene,
    CreateGameScene,
    JoinGameScene,
  ]
};
 
export const game = new Phaser.Game(gameConfig);