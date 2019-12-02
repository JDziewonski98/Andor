import * as Phaser from 'phaser';
import { Tile } from './tile';
import { HourTracker } from './hourTracker';

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
        if (this.hourTracker.count < 7) {
            this.tile = newTile;
            this.x = newTile.x;
            this.y = newTile.y;
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            this.hourTracker.count++;
            this.hourTracker.sprite.x += 50;
            this.hourTracker.x += 50;
        }
        return this;
    }

    public resetHours() {
        this.hourTracker.count = 0;
    }

}