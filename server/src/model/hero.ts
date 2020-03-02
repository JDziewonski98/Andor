import { HeroKind } from "./HeroKind";
import { Region } from './region';

export class Hero {
    private hk: HeroKind;
    //private region: Region;
    private gold!: number;
    private strength!: number;
    private will!: number;
    private moveCompleted: boolean = false;
    private timeOfDay: number = 1;
    private farmer: boolean = false;

    constructor(hk: HeroKind) {
        this.hk = hk
        this.initializeResources()
    }

    private moveTo(newTile) {
        //TODO
    }

    public useItem(item) {
        //TODO
    }

    public getGold() {
        return this.gold;
    }

    public setGold(amount) {
        this.gold = amount;
    }

    private setTimeOfDay(time) {
        this.timeOfDay = time;
    }

    public getTimeOfDay() {
        return this.timeOfDay;
    }

    private setMoveCompleted(b) {
        this.moveCompleted = b;
    }

    private setRegion(r) {
        //this.region = r;
    }

    private pickupFarmer() {
        // TODO: Implement
    }

    private farmerSlotEmpty() {
        //what does this do?
    }

    private dropGold(amount) {
        // TODO: implement
    }

    private initializeResources() {
        if (this.hk === HeroKind.Archer) {
            this.gold = 1
            this.strength = 2
            this.will = 3
        } else if (this.hk === HeroKind.Dwarf) {
            this.gold = 1
            this.strength = 2
            this.will = 3
        } else if (this.hk === HeroKind.Mage) {
            this.gold = 1
            this.strength = 2
            this.will = 3
        } else if (this.hk === HeroKind.Warrior) {
            this.gold = 1
            this.strength = 2
            this.will = 3
        }
    }




}