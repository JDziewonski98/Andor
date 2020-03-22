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
    private rank: number;
    private dice

    private wineskin: boolean = false;

    constructor(hk: HeroKind, region:Region) {
        this.hk = hk
        if(this.hk === "dwarf"){
            this.rank = 7
        }
        else if(this.hk === "warrior"){
            this.rank = 14
        }
        else if(this.hk === "archer"){
            this.rank = 25
        }
        else{
            this.rank = 34
        }
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
    public getRank(): number{
        return this.rank;
    }
    public moveTo(newTile: Region) {
        this.region = newTile
        this.timeOfDay++
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

    public updateGold(goldDelta) {
        this.gold += goldDelta;
    }

    // TODO: actual wineskin implementation instead of boolean flag
    public getWineskin() {
        return this.wineskin;
    }

    public setWineskin(hasWineskin) {
        this.wineskin = hasWineskin;
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
            this.farmers.push(farmer);
            return this.region;
        }
        return this.region;
    }

    public dropFarmer() {
        var r_farmers = this.region.getFarmers();
        var result = new Array()
        if(r_farmers.length < 2 && this.farmers.length > 0){
            var farmer = this.farmers.pop()!;
            farmer.carriedBy = undefined;
            farmer.tile = this.region;
            this.region.getFarmers().push(farmer);
            result.push(farmer.id)
            result.push(this.region.getID())
            return result;
        }
        return result;
    }

    private farmerSlotEmpty() {
        //what does this do?
    }

    public dropGold() {        
        if (this.gold < 1) {
            return false
        }
        else {                        
            //decrease the amount you have
            this.gold -= 1
            //increase the amount on tile
            this.region.setGold(this.region.getGold() + 1)
            
            return true
        }       
    }

    public pickupGold() {
        if (this.region.getGold() <= 0) {
            return false
        }
        else {
            //var reg = this.region
            //decrease gold on region
            this.region.setGold((this.region.getGold() - 1))
            //reg.setGold(reg.getGold() - 1)
            //increase your gold
            this.setGold(this.gold + 1)
            return true
        }
    }

    public setWill(willValueToChange: number) {
        this.will += willValueToChange
    }

    public setStrength(strengthChange: number) {
        this.strength += strengthChange
    }

    public resetWill() {
        this.will = 3
    }

    // Returns the amount of willpower to increment by to the client.
    // If request is invalid, then return -1 as failure value.
    public useWell() {
        let wpInc = -1;
        var reg = this.region;
        if (reg.getHaswell() && !reg.getWellUsed()) {
            //increase 3 will power
            if (this.will <= 17) {
                this.setWill(3);
                wpInc = 3;
            }
            else if (this.will <= 20 && this.will > 17) {
                this.will = 20;
                wpInc = (20 - this.will);
            }
            //set the boolean of whether a well was used
            reg.setWellUsed(true);
        }
        return wpInc;
    }

    public getWill() {
        return this.will
    }

    public roll() {

        this.timeOfDay = this.timeOfDay + 1;
        
        var dicefaces = [1, 2, 3, 4, 5, 6]
        var rollamt = 0
        var rolls: number[] = []

        if (this.will < 7) {
            rollamt = this.dice[0]
        }
        else if (this.will < 14) {
            rollamt = this.dice[1]
        }
        else {
            rollamt = this.dice[2]
        }

        for (let i = 0; i < rollamt; i++) {
            let roll = dicefaces[Math.floor(Math.random() * dicefaces.length)]
            rolls.push(roll)
        }

        var max = Math.max(...rolls)
        var attack = this.strength + max
        console.log('str', this.strength, 'max', max)
        return attack

    }

    private initializeResources() {
        this.will = 7;
        this.strength = 1;

        if (this.hk === HeroKind.Archer) {
            this.gold = 1
            this.dice = [3,4,5]
            //this.region = new Region(25, false, 24, [23, 24, 31, 27, 26], false)
        } else if (this.hk === HeroKind.Dwarf) {
            this.gold = 2
            this.dice = [1,2,3]
           // this.region = new Region(7, false, 0, [
             //   15, 9, 8, 0, 11
            //], false)
        } else if (this.hk === HeroKind.Mage) {
            this.gold = 4;
            this.dice = [1,1,1]
            /* this.region = new Region(24, false, 23, [   //SHOULD BE 34!!!!!!
                72, 23, 35, 30, 29
            ], false) */
        } else if (this.hk === HeroKind.Warrior) {
            this.gold = 1
            this.dice = [2,3,4]
            /* this.region = new Region(14, false, 2, [
                2, 3, 6, 10, 17, 18
            ], false) */
        }
    }




}