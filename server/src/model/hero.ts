import { HeroKind } from "./HeroKind";
import { Region } from './region';
import { Farmer } from '.';

export class Hero {
    public hk: HeroKind;
    private region!: Region;
    private gold!: number;
    private strength!: number;
    private will!: number;
    private moveCompleted: boolean = false;
    private timeOfDay: number = 1;
    private farmer: boolean = false;
    private farmers: Array<Farmer>;

    constructor(hk: HeroKind, region:Region) {
        this.hk = hk
        this.region = region;
        this.farmers = new Array()
        this.initializeResources()
    }

    public getKind(): HeroKind {
        return this.hk;
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

    public setRegion(r: Region) {
        this.region = r;
    }

    public getRegion(){
        return this.region;
    }

    public getFarmers(){
        return this.farmers
    }
    public canMoveTo(tile){
       
    }

    public pickupFarmer() {
        var r_farmers = this.region.getFarmers();
        if(r_farmers.length != 0 && (this.region.getID() === r_farmers[r_farmers.length-1].tile.getID())){
            var farmer = this.region.getFarmers().pop()!;
            farmer.carriedBy = this;
            this.farmer = true;
            this.farmers.push(farmer);
            return true;
        }
        return false;
    }

    private farmerSlotEmpty() {
        //what does this do?
    }

    private dropGold(amount) {
        // TODO: implement
    }

    public setWill(willValueToChange: number) {
        this.will += willValueToChange
    }

    public useWell() {
        var reg = this.region
        if (reg.getHaswell() && !reg.getWellUsed()) {
            //increase 3 will power
            if (this.will <= 17) {
                this.setWill(3)
            }
            else if (this.will <= 20 && this.will > 17) {
                this.will = 20
            }
            //set the boolean of whether a well was used
            reg.setWellUsed(true)

            //inform front-end that a well has been used
            return true
        }
        return false
    }

    public getWill() {
        return this.will
    }

    private initializeResources() {
        this.will = 7;
        this.strength = 1;

        if (this.hk === HeroKind.Archer) {
            this.gold = 1
            //this.region = new Region(25, false, 24, [23, 24, 31, 27, 26], false)
        } else if (this.hk === HeroKind.Dwarf) {
            this.gold = 1
           // this.region = new Region(7, false, 0, [
             //   15, 9, 8, 0, 11
            //], false)
        } else if (this.hk === HeroKind.Mage) {
            this.gold = 1
            /* this.region = new Region(24, false, 23, [   //SHOULD BE 34!!!!!!
                72, 23, 35, 30, 29
            ], false) */
        } else if (this.hk === HeroKind.Warrior) {
            this.gold = 1
            /* this.region = new Region(14, false, 2, [
                2, 3, 6, 10, 17, 18
            ], false) */
        }
    }




}