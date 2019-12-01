import { Tile } from '../objects/tile';
import { Tilemaps } from 'phaser';
import { Window } from './window'
import { Hero } from '../objects/hero';

export default class GameScene extends Phaser.Scene {
  private weed: Phaser.GameObjects.Sprite;
  private hourBar;
  private hero: Hero;
  public tiles: Tile[] = [];
  private count: number = 0;
  private gameText;
  private windows: Window[] = []
  private hours;

  constructor() {
    super({ key: 'Game' });
  }

  public preload() {
    this.load.multiatlas('tiles', './assets/tilesheet.json', 'assets')
  }

  public create() {
    //i thought the andor board background was kind of messy
    //this.add.image(500, 300, 'map');
    this.add.image(500, 300, 'andordude').setDisplaySize(1000, 600)
    this.add.image(800, 40, 'hourbar').setDisplaySize(400, 75);
    var id: number = 0;


    // temporary lambda function to load a few different tile icons when making tiles
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
      id = i;
      for (let j = 0; j < numRows; j++) { //num rows
        var atlastextures = this.textures.get('tiles')
        var tiles = atlastextures.getFrameNames()
        //we can now reference each tile image by index
        //Tile new extends sprite so we can pass a image to use for it.
        let rect: Tile = this.add.existing(new Tile(id, this, 300 + 75 * i, 200 + 75 * j, tiles[tilelogic(i, j)])) as any;
        id += numCols;
        this.tiles.push(rect);
        rect.setInteractive();
        rect.on('pointerdown', function (pointer) { this.printstuff() });
        rect.on('pointerdown', function (pointer) { this.moveRequest() })
      }
    }
    this.setTileAdjacencies(this.tiles, numRows, numCols);

    this.weed = this.add.sprite(this.tiles[0].x, this.tiles[0].y, 'weed');
    this.hero = new Hero(0, this, this.weed, 0, 0, tiles[0]);
    this.hero.hourTrackerImage = this.add.image(625, 40, 'weed').setDisplaySize(40, 40);
    this.weed.depth = 5;
    this.tiles[0].hero = this.hero;
    this.tiles[0].heroexist = true;

    this.weed.setInteractive();
    // TODO Important!!!! gotta find a way to clear data when u exit a scene or else problems happen
    this.weed.on('pointerdown', function (pointer) {
      console.log(this.tiles.length)
      //gotta kill all the window scenes or else they will remain if you exit the scene
      this.killwindows()
      this.windows = []
      this.tiles = []
      this.scene.start('Lobby');
    }, this);

    var style2 = {
      fontFamily: '"Roboto Condensed"',
      fontSize: "20px",
      backgroundColor: '#f00'
    }
    this.gameText = this.add.text(400, 10, "You: 5g / 3 str / 8 will", style2)
    this.gameText.setInteractive();
    this.gameText.on('pointerup', function (pointer) {

      if (!Window.window) {
        this.createWindow(200, 200, 'herowindow');
        console.log('here')
      }
      else {
        console.log('there')
        let win = Window.getInstance(200, 200, 'herowindow')
        win.revive()
      }
    }, this);

    //this.input.keyboard.on('keydown_A',this.killwindows,this)


  }


  public createWindow(width, height, funct) {
    var x = Phaser.Math.Between(400, 600);
    var y = Phaser.Math.Between(64, 128);

    var handle = 'window' + this.count++;

    var win = this.add.zone(x, y, width, height).setInteractive();

    var demo = Window.getInstance(handle, win, funct);

    this.input.setDraggable(win);

    win.on('drag', function (pointer, dragX, dragY) {

      this.x = dragX;
      this.y = dragY;

      demo.refresh()

    });

    this.scene.add(handle, demo, true);
    this.windows.push(demo)
  }

  public killwindows() {
    this.windows.forEach(element => {
      element.kill()
    });
  }

  //leetcode hard algorithm
  public setTileAdjacencies(tiles: Tile[], rows: number, cols: number) {
    for (let i = 0; i < tiles.length; i++) {
      //left
      if (tiles[i].id % cols != 0) { tiles[i].adjacent.push(tiles[i - rows]) }
      //right
      if (tiles[i].id % cols != cols - 1) { tiles[i].adjacent.push(tiles[i + rows]) }
      //down
      if (tiles[i].id < ((cols * rows) - 1)) { tiles[i].adjacent.push(tiles[i + 1]) }
      //up
      if (tiles[i].id >= cols) { tiles[i].adjacent.push(tiles[i - 1]) }
    }
  }

  public update() {
  }
}