import * as Phaser from 'phaser';
import { Tile } from './tile';
import { mOffset } from '../constants'
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
        this.x = tile.x + mOffset;
        this.y = tile.y;
        this.tile = tile;
    }

    public destroyMonster(){
        this.destroy();
    }

    public moveToTile(newTile: Tile) {
        // Update old and new tiles
        var oldTile = this.tile;
        oldTile.monster = null;
        newTile.monster = this;

        if (newTile.getID() == 0) {
            this.destroyMonster();
        }
        // Update monster tile and x,y
        this.tile = newTile;
        this.x = this.tile.x + mOffset;
        this.y = this.tile.y;
    }

}