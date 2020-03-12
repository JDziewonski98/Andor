import * as Phaser from 'phaser';
import { Tile } from './tile';
import { Hero } from './hero';
//import { HourTracker } from './hourTracker';
// import { boardScalingFactor } from '../scenes/game'

// Why are Heroes Sprites and also take a Sprite as a constructor
// param? Why not just use the Sprite texture - then we don't have
// to update two things all the time
export class Farmer extends Phaser.GameObjects.Sprite {
    public id: number
    public tile: Tile;
    public x: number;
    public y: number;
    public carriedBy: Hero;

    constructor(id,scene, tile: Tile, texture:string) {
        super(scene, tile.x, tile.y, texture);
        this.id = id;
        this.x = tile.x;
        this.y = tile.y;
        this.carriedBy = null;
        this.tile = tile;
    }

    public setTile(newTile: Tile){
        this.tile = newTile;
        this.x = newTile.x
        this.y = newTile.y
    }

    public destoryFarmer(){
        this.destroy();
    }

}