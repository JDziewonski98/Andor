import * as Phaser from 'phaser';
import { Tile } from './tile';
import { HourTracker } from './hourTracker';
import { Farmer } from './farmer';
// import { boardScalingFactor } from '../scenes/game'

// Why are Heroes Sprites and also take a Sprite as a constructor
// param? Why not just use the Sprite texture - then we don't have
// to update two things all the time
export class Hero extends Phaser.GameObjects.Sprite {
    public tile: Tile;
    public hourTracker: HourTracker;
    public farmer: Array<Farmer>;

    constructor(scene, tile: Tile, texture: string) {
        super(scene, tile.x, tile.y, texture);
        this.farmer = new Array();
        this.tile = tile;
        this.hourTracker = null;
        
    }

    public move(newTile) {
        // All heroes use the same hour tracker, access with their id
        if (this.hourTracker.getCount(this.id) < 7) {
            // this.tile = newTile;
            // this.x = newTile.heroCoords[this.id][0];
            // this.y = newTile.heroCoords[this.id][1];
            // this.sprite.x = this.tile.x;
            // this.sprite.y = this.tile.y;
            // this.hourTracker.incHour(this.id);
        }
        return this;
    }

    public resetHours() {
        this.hourTracker.reset(this.id);
    }

    public dropGold(amount) {

    }
}