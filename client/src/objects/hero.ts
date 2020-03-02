import * as Phaser from 'phaser';
import { Tile } from './tile';
import { HourTracker } from './hourTracker';
// import { boardScalingFactor } from '../scenes/game'

// Why are Heroes Sprites and also take a Sprite as a constructor
// param? Why not just use the Sprite texture - then we don't have
// to update two things all the time
export class Hero extends Phaser.GameObjects.Sprite {
    public id: number;
    public tile: Tile;
    public x: number;
    public y: number;
    public hourTracker: HourTracker;
    public sprite: Phaser.GameObjects.Sprite;

    constructor(id, scene, sprite, x, y, tile) {
        super(scene, sprite, x, y);
        this.id = id;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }

    public move(newTile) {
        // All heroes use the same hour tracker, access with their id
        if (this.hourTracker.getCount(this.id) < 7) {
            this.tile = newTile;
            this.x = newTile.x;
            this.y = newTile.y;
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            this.hourTracker.incHour(this.id);
        }
        return this;
    }

    public resetHours() {
        this.hourTracker.reset(this.id);
    }

}