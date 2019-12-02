import * as Phaser from 'phaser';
import Scenes from './scenes';
import Model from './model'

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
  scene: Scenes
};
 
// export const game = new Phaser.Game(gameConfig);
export default class AndorGame extends Phaser.Game {
  public globals
  constructor () {
    super(gameConfig);
    var model = new Model();
    this.globals = { model, bgMusic: null };
  }
}

// var game = new AndorGame();
export const andorGame = new AndorGame()