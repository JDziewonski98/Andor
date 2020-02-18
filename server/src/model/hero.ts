import { HeroKind } from "./HeroKind";
import { Region } from './region';

export class Hero {
    private hk: HeroKind;
    private region: Region;
    private gold: Number;
    private strength: Number;
    private will: Number;
    private moveCompleted: Boolean = false;
    private timeOfDay: Number = 1;
    private farmer: Boolean = false;

    constructor(hk, region, gold, strength, will) {
        this.hk = hk
        this.region = region
        this.gold = gold
        this.strength = strength
        this.will = will
        //need to add socket call to frontend to create hero instance
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