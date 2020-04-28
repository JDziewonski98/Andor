import * as Phaser from 'phaser';
import { Tile } from './tile';
import { HourTracker } from './hourTracker';
import { Farmer } from './farmer';
import { HeroKind } from './herokind';

export class Hero extends Phaser.GameObjects.Sprite {
    public tile: Tile;
    public hourTracker: HourTracker;
    // public farmers: Array<Farmer>;
    private hour: number;
    private willPower: number;
    private strength: number;
    // private gold: number;
    private heroKind: HeroKind

    constructor(scene, tile: Tile, texture: string, kind: HeroKind, hour: number) {
        super(scene, tile.x, tile.y, texture);
        // this.farmers = new Array();
        switch (kind) {
            case "archer":
                super(scene, tile.x - 30, tile.y - 30, texture);
                break;
            case "dwarf":
                super(scene, tile.x + 30, tile.y - 30, texture);
                break;
            case "mage":
                super(scene, tile.x - 30, tile.y + 30, texture);
                break;
            case "warrior":
                super(scene, tile.x + 30, tile.y + 30, texture);
                break;
        }
        this.tile = tile;
        this.hourTracker = null;
        this.hour = hour;
        this.heroKind = kind;
        this.initializeResources();
    }

    private initializeResources() {
        this.willPower = 7;
        this.strength = 1;
    }

    public moveTo(newTile: Tile) {
        let newCoords = this.getPosOnTile(newTile);
        this.x = newCoords.x;
        this.y = newCoords.y;
        this.tile = newTile
        //this.hourTracker.incHour(this.heroKind)
    }

    public getPosOnTile(t: Tile) {
        let newX = t.x;
        let newY = t.y;
        switch (this.heroKind) {
            case "archer":
                newX = t.x - 30
                newY = t.y - 30
                break;
            case "dwarf":
                newX = t.x + 30
                newY = t.y - 30
                break;
            case "mage":
                newX = t.x - 30
                newY = t.y + 30
                break;
            case "warrior":
                newX = t.x + 30
                newY = t.y + 30
                break;
        }
        return { x: newX, y: newY };
    }

    public getHour(){
        return this.hour;
    }

    public resetHours() {
        // this.hourTracker.reset(this.id);
    }
    
    public getKind() {
        return this.heroKind;
    }

    public incrementHour() {
        this.hourTracker.incHour(this.heroKind)
    }

    public setwillPower(willValToChange) {
        this.willPower += willValToChange;
    }

    public getWillPower() {
        return this.willPower;
    }

    public resetWillPower() {
        this.willPower = 3;
    }

    public getStrength() {
        return this.strength
    }

    public setStrength(change) {
        this.strength += change;
    }
}