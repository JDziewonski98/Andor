import * as Phaser from 'phaser';
import { Tile } from './tile';
import { HourTracker } from './hourTracker';
import { Farmer } from './farmer';
import { HeroKind } from './herokind';

export class Hero extends Phaser.GameObjects.Sprite {
    public tile: Tile;
    public hourTracker: HourTracker;
    public farmers: Array<Farmer>;
    private hour: number;
    private willPower: number;
    private strength: number;
    private gold: number;
    private heroKind: HeroKind

    constructor(scene, tile: Tile, texture: string, kind: HeroKind) {
        super(scene, tile.x, tile.y, texture);
        this.farmers = new Array();
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
        this.hour = 1;
        this.heroKind = kind;
        this.initializeResources();
    }

    private initializeResources() {
        this.willPower = 7;
        this.strength = 1;
        this.gold = 5;

        /**
        if (this.hk === HeroKind.Archer) {
            this.gold = 1
            
        } else if (this.hk === HeroKind.Dwarf) {
            this.gold = 1
            
        } else if (this.hk === HeroKind.Mage) {
            this.gold = 1
            
        } else if (this.hk === HeroKind.Warrior) {
            this.gold = 1
            
        }
        */
    }

    public moveTo(newTile: Tile) {
        switch (this.heroKind) {
            case "archer":
                this.x = newTile.x - 30
                this.y = newTile.y - 30
                break;
            case "dwarf":
                this.x = newTile.x + 30
                this.y = newTile.y - 30
                break;
            case "mage":
                this.x = newTile.x - 30
                this.y = newTile.y + 30
                break;
            case "warrior":
                this.x = newTile.x + 30
                this.y = newTile.y + 30
                break;
        }
        this.tile = newTile
        this.hourTracker.incHour(this.heroKind)
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
    /*public dropGold(amount) {
        if (this.gold < amount) {
            return false
        }
        else {
            var reg = this.tile

            //decrease the amount you have
            this.setGold(this.gold - amount)
            //increase the amount on tile
            reg.setGold(reg.getGold() + amount)

            return true
        }
    }*/

    /*public pickupGold() {
        if (this.tile.getGold() === 0) {
            return false
        }
        this.tile.setGold(this.tile.getGold() - 1)
    }*/

    public setwillPower(willValToChange) {
        this.willPower += willValToChange;
    }

    public getWillPower() {
        return this.willPower;
    }

    public getGold() {
        return this.gold;
    }

    public setGold(amount) {
        this.gold = amount;
    }

    public getStrength() {
        return this.strength
    }
}