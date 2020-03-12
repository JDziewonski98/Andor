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

    private wineskin: boolean = false;

    constructor(hk: HeroKind, region:Region) {
        this.hk = hk
        this.region = region;
        this.farmers = new Array()
        this.initializeResources()
    }

    public getData(){
        let data = {hk: this.hk, gold: this.gold, strength: this.strength, will: this.will, farmers: this.farmers.length};
        return data;
    }

    public getKind(): HeroKind {
        return this.hk;
    }

    public moveTo(newTile: Region) {
        this.region = newTile
        this.timeOfDay ++
        console.log(this.hk, " moved to ", newTile.getID(), " and now is at ", this.timeOfDay)
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

    public buyStrength(){
        //If hero is the Dwarf, strength costs 1 gold at the Dwarf mine on tile 71
        if(this.gold >= 1 && this.hk === HeroKind.Dwarf && this.region.getID() === 71){
            this.gold -= 1;
            this.strength++;
            return true;
        //Strength costs 2 for all heros everywhere else exceopt tile 71
        }else if(this.gold >= 2 && this.region.getMerchant() === true){
            this.gold -= 2;
            this.strength++;
            return true;
        }
        else{
            return false;
        }
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
            this.gold = 2
           // this.region = new Region(7, false, 0, [
             //   15, 9, 8, 0, 11
            //], false)
        } else if (this.hk === HeroKind.Mage) {
            this.gold = 4;
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