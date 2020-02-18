import { HeroKind } from "./HeroKind";
import { Region } from './region';

export class Hero {
    private hk: HeroKind;
    private region: Region;
    private gold: number;
    private strength: number;
    private will: number;
    private moveCompleted: boolean = false;
    private timeOfDay: number = 1;
    private farmer: boolean = false;

    constructor(hk: HeroKind, region: Region, gold: number, strength: number, will: number) {
        this.hk = hk
        this.region = region
        this.gold = gold
        this.strength = strength
        this.will = will
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
        this.region = r;
    }


    //what is difference between these 2???????
    private pickupFarmer() {
        //todo
    }
    private addFarmer(f) {
        //todo
    }

    private farmerSlotEmpty() {
        //what does this do?
    }

    private dropGold(amount) {
        //todo
    }




}