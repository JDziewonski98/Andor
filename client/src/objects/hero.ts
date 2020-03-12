import * as Phaser from 'phaser';
import { Tile } from './tile';
import { HourTracker } from './hourTracker';
import { Farmer } from './farmer';
import { HeroKind } from '../scenes/HeroKind';

export class Hero extends Phaser.GameObjects.Sprite {
    public tile: Tile;
    public hourTracker: HourTracker;
    public farmer: Array<Farmer>;
    private hour:  number;
    private heroKind: string;

    constructor(scene, tile: Tile, texture: string, heroKind: string) {
        super(scene, tile.x, tile.y, texture);
        this.farmer = new Array();
        this.tile = tile;
        this.hourTracker = null;
        this.hour = 1;
        this.heroKind = heroKind;
        
    }

    public moveTo(newTile) {
        this.tile = newTile 
        this.x = newTile.x
        this.y = newTile.y
        console.log(this.tile)
        // All heroes use the same hour tracker, access with their id
            // this.tile = newTile;
            // this.x = newTile.heroCoords[this.id][0];
            // this.y = newTile.heroCoords[this.id][1];
            // this.sprite.x = this.tile.x;
            // this.sprite.y = this.tile.y;
            // this.hourTracker.incHour(this.id);
        return this;
    }

    public resetHours() {
        // this.hourTracker.reset(this.id);
    }
    public getKind(){
        return this.heroKind;
    }

    public dropGold(amount) {

    }
}