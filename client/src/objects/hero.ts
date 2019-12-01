import * as Phaser from 'phaser';
import { Tile } from '../objects/tile';

export class Hero extends Phaser.GameObjects.Sprite {
    public id: number;
    public tile: Tile;
    public x: number;
    public y: number;
    public hourTrackerImage: Phaser.GameObjects.Image;
    public hourTracker: number;

    public sprite: Phaser.GameObjects.Sprite;
    constructor(id, scene, sprite, x, y, tile) {
        super(scene, sprite, x, y, tile);
        this.id = id;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.hourTracker = 0;
    }

    public move(newTile) {
        if (this.hourTracker != 7) {
            this.tile = newTile;
            this.x = newTile.x;
            this.y = newTile.y;
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            this.hourTracker++;
            this.hourTrackerImage.x += 50;
            return this;
        }
        else {
            return this;
        }


    }

}