import * as Phaser from 'phaser';
import { Tile } from './tile';

export class Prince extends Phaser.GameObjects.Sprite {
    public tile: Tile;

    constructor(scene, tile: Tile, texture: string) {
        super(scene, tile.x, tile.y, texture);
        this.tile = tile;
    }

    public moveTo(newTile: Tile) {
        this.x = newTile.x + 15
        this.y = newTile.y - 30
        this.tile = newTile
    }

}