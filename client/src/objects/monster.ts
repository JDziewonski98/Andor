import * as Phaser from 'phaser';
import { Tile } from './tile';
//import { HourTracker } from './hourTracker';
// import { boardScalingFactor } from '../scenes/game'

// Why are Heroes Sprites and also take a Sprite as a constructor
// param? Why not just use the Sprite texture - then we don't have
// to update two things all the time
export class Monster extends Phaser.GameObjects.Sprite {
    public tile: Tile;
    public x: number;
    public y: number;
    public name: string;

    constructor(scene, tile: Tile, texture:string, name: string) {
        super(scene, tile.x, tile.y, texture);
        this.name = name;
        this.x = tile.x - 40;
        this.y = tile.y;
        this.tile = tile;
    }

    public destoryMonster(){
        this.destroy();
    }

}