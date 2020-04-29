import { HeroKind } from "./HeroKind";
import { Region } from './region';
import { Farmer } from '.';
import { LargeItem } from './LargeItem'
import { SmallItem } from './SmallItem'

export class Hero {
    public hk: HeroKind;
    private region: Region;
    private gold: number;
    private strength: number;
    private will: number;
    private timeOfDay: number;
    private farmers: Array<Farmer>;
    private rank: number;
    private dice
    private freeMoves:number;
    private movePrinceCtr;
    private hasMovedThisTurn: boolean = false; // Used for checking turn passing
    private hasFoughtThisTurn: boolean = false; // Used for checking turn passing

    //items
    private wineskin: boolean;
    private largeItem: LargeItem;
    private helm: boolean;
    private smallItems: SmallItem[];

    constructor({ timeOfDay, wineskin, largeItem, helm, smallItems, hk, rank, region, farmers, will, strength, gold, dice, freeMoves, hasMovedThisTurn, hasFoughtThisTurn, movePrinceCtr}) {
        this.hk = hk;
        this.rank = rank;
        this.gold = gold;
        this.strength = strength;
        this.will = will;
        this.dice = dice;
        this.timeOfDay = timeOfDay;
        this.wineskin = wineskin;
        this.largeItem = largeItem;
        this.smallItems = smallItems;
        this.helm = helm;
        this.region = region;
        this.farmers = farmers;
        this.freeMoves = freeMoves;
        this.hasMovedThisTurn = hasMovedThisTurn;
        this.hasFoughtThisTurn = hasFoughtThisTurn;
        this.movePrinceCtr = movePrinceCtr;
    }

    public getData(){
        let data = {
            hk: this.hk, 
            gold: this.gold, 
            strength: this.strength,
            will: this.will, 
            farmers: this.farmers.length, 
            largeItem: this.largeItem, 
            currtileid:this.region.getID(),
            timeofday: this.timeOfDay,
            dice: this.getDice()
        };
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
        if (this.freeMoves == 0) {
            this.timeOfDay++
            //because timeOfDay starts at 1
            if(this.timeOfDay >= 9){
                this.will = this.will-2
            }
        }
        else {
            this.freeMoves--
        }
        //TODO: DONT UPDATE THE HOUR TRACKER THING.
    }
    public freeMoveTo(newTile:Region){
        this.region = newTile
        this.timeOfDay++
    }

    //Prince has oen moveTo, this just increments timeOfDay
    public movePrince(){
        this.movePrinceCtr++;
        this.timeOfDay++;
    }

    public resetPrinceMoves(){
        this.movePrinceCtr = 0;
    }

    public getNumPrinceMoves(){
        return this.movePrinceCtr;
    }

    public exhaustingMoveTo(newTile: Region){
        this.region = newTile
        if (this.freeMoves == 0) {
            this.timeOfDay++
            this.will = this.will-3
            
        }
        else {
            this.freeMoves--
        }
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

    public updateGold(goldDelta: number) {
        this.gold += goldDelta;
    }

    // TODO: actual wineskin implementation instead of boolean flag
    // public getWineskin() {
    //     return this.wineskin;
    // }

    // public setWineskin(hasWineskin) {
    //     this.wineskin = hasWineskin;
    // }

    public setTimeOfDay(time) {
        this.timeOfDay = time;
    }

    public getTimeOfDay() {
        return this.timeOfDay;
    }

    public setHasMovedThisTurn(hasMoved: boolean) {
        this.hasMovedThisTurn = hasMoved;
    }

    public getHasMovedThisTurn() : boolean {
        return this.hasMovedThisTurn;
    }

    public setHasFoughtThisTurn(hasFought: boolean) {
        this.hasFoughtThisTurn = hasFought;
    }

    public getHasFoughtThisTurn() : boolean {
        return this.hasFoughtThisTurn;
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

    public removeAllFarmers() {
        this.farmers = new Array();
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

    public buyHelm(){
        if(this.gold >= 2 && this.helm == false && this.region.getMerchant() === true){
            this.gold -= 2;
            this.helm = true;
            return true;
        }
        else{
            return false;
        }
    }

    public buyWine(){
        if(this.gold >= 2 && this.smallItems.length < 3 && this.region.getMerchant() === true){
            this.gold -= 2;
            this.smallItems.push(SmallItem.Wineskin);
            return true;
        }
        else{
            return false;
        }

    }

    public buyTelescope(){
        if(this.gold >= 2 && this.smallItems.length < 3 && this.region.getMerchant() === true){
            this.gold -= 2;
            this.smallItems.push(SmallItem.Telescope);
            return true;
        }
        else{
            return false;
        }
    }

    public buyBow(){
        if(this.gold >= 2 && this.largeItem == LargeItem.Empty && this.region.getMerchant() === true){
            this.gold -= 2;
            this.largeItem = LargeItem.Bow;
            return true;
        }
        else{
            return false;
        }
    }

    public buyFalcon(){
        if(this.gold >= 2 && this.largeItem == LargeItem.Empty && this.region.getMerchant() === true){
            this.gold -= 2;
            this.largeItem = LargeItem.Falcon;
            return true;
        }
        else{
            return false;
        }
    }

    public buyShield(){
        if(this.gold >= 2 && this.largeItem == LargeItem.Empty && this.region.getMerchant() === true){
            this.gold -= 2;
            this.largeItem = LargeItem.Shield;
            return true;
        }
        else{
            return false;
        }
    }

    public pickupFarmer() {
        var r_farmers = this.region.getFarmers();
        if(r_farmers.length != 0 && (this.region.getID() === r_farmers[r_farmers.length-1].getTileID())){
            var farmer = this.region.getFarmers().pop()!;
            // farmer.carriedBy = this;
            this.farmers.push(farmer);
            return true;
            // return this.region;
        }
        // return this.region;
        return false;
    }

    public dropFarmer() {
        var r_farmers = this.region.getFarmers();
        var result = new Array()
        if(r_farmers.length < 2 && this.farmers.length > 0){
            var farmer = this.farmers.pop()!;
            // farmer.carriedBy = undefined;
            if(this.region.getID() != 0){
                farmer.setTileID(this.region.getID());
                this.region.getFarmers().push(farmer);
            }
            result.push(farmer.getFarmerID())
            result.push(this.region.getID())
            return result;
        }
        return result;
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
        //decrease gold on region
        this.region.setGold((this.region.getGold() - 1))
        
        //increase your gold
        this.gold += 1        
        return true
    }

    public setWill(willValueToChange: number) {
        this.will += willValueToChange
        if(this.will < 1){
            this.will = 3
            if(this.strength !=1)
            this.setStrength(-1)
        }
    }

    public setStrength(strengthChange: number) {
        this.strength += strengthChange
    }
    public getStrength(){
        return this.strength
    }

    public resetWill() {
        this.will = 3
    }

    // Returns the amount of willpower to increment by to the client.
    // If request is invalid, then return -1 as failure value.
    public useWell() {
        let wpInc = -1;
        var reg = this.region;
        if (reg.getHasWell() && !reg.getWellUsed()) {
            if (this.hk == HeroKind.Warrior) {
                // increase 5WP
                this.will += 5;
                wpInc = this.will > 20 ? 25-this.will : 5;
            } else {
                //increase 3 will power
                this.will += 3;
                wpInc = this.will > 20 ? 23-this.will : 3;
            }
            if (this.will > 20) this.will = 20;
            //set the boolean of whether a well was used
            reg.setWellUsed(true);
        }
        return wpInc;
    }

    public getWill() {
        return this.will
    }

    public incrementHour() {
        this.timeOfDay++
    }

    public getDice() {
        var rollamt;
        var returnedtext = '';
        if (this.will < 7) {
            rollamt = this.dice[0]
        }
        else if (this.will < 14) {
            rollamt = this.dice[1]
        }
        else {
            rollamt = this.dice[2]
        }
        if (this.smallItems.includes(SmallItem.BlueRunestone) && this.smallItems.includes(SmallItem.YellowRunestone) && this.smallItems.includes(SmallItem.GreenRunestone)) {
            returnedtext = 'You have 1 Black die, ' + (rollamt - 1) + ' red dice.'
        }
        else {
            returnedtext = rollamt + ' red dice.'
        }
        var dicesplit = this.dice[0] + ' below 7 will, ' + this.dice[1] + ' below 14 will, ' + this.dice[2] + ' above 14 will.'
        return returnedtext + ' ' + dicesplit;
    }

    public roll(usingBow = false) {

        var dicefaces = [1, 2, 3, 4, 5, 6]
        var blackdie = [6, 6, 8, 10, 10, 12]
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
            let roll
            //the black die is always the first one rolled.
            if (this.smallItems.includes(SmallItem.BlueRunestone) && this.smallItems.includes(SmallItem.YellowRunestone) && this.smallItems.includes(SmallItem.GreenRunestone) && i == 0) {
                console.log('a black die has been rolled due to runestone triple threat!')
                roll = blackdie[Math.floor(Math.random() * blackdie.length)]
            }
            else {
                roll = dicefaces[Math.floor(Math.random() * dicefaces.length)]
            }
            rolls.push(roll)
        }

        var attack = 0

        if (this.hk != HeroKind.Archer && usingBow == false){
            let max = Math.max(...rolls)
            //var attack = this.strength + max
            //we need to return all rolls in case dwarf or warrior wants to use helmet.
            return {roll:max, strength:this.strength, alldice:rolls}
        }
        else {
            //in case of archer we need to roll one at a time...
            //alldice will not be used in this case
            return {rolls:rolls, strength:this.strength, alldice:rolls}
        }
    }
    public eventRoll(){
        var dicefaces = [1, 2, 3, 4, 5, 6]
        var roll
        roll = dicefaces[Math.floor(Math.random() * dicefaces.length)]
        return roll
    }
    private initializeResources() {
        this.will = 7;
        this.strength = 1;

        if (this.hk === HeroKind.Archer) {
            this.gold = 1
            this.dice = [3,4,5]
        } else if (this.hk === HeroKind.Dwarf) {
            this.gold = 2
            this.dice = [1,2,3]
        } else if (this.hk === HeroKind.Mage) {
            this.gold = 4;
            this.dice = [1,1,1]
        } else if (this.hk === HeroKind.Warrior) {
            this.gold = 1
            this.dice = [2,3,4]
        }
    }

    ///////////////////////
    /// ITEM METHODS
    //////////////////////

    public getItemDict() {
        /*
        Format:
        helm: 'true' || 'false'
        largeItem: 'falcon' || 'shield' || 'bow' || 'empty'
        */
        //TODO
        let helm = this.helm == true ? 'true' : 'false'
        let itemdict = {largeItem: this.largeItem, helm:helm, smallItems:this.smallItems, gold:this.gold}
        return itemdict 
    }

    public consumeItem(item){
        switch(item) {
            case 'helm': 
                if  (this.helm == true) {
                    this.helm = false
                }
                break;

            case 'herb':
                break;

            case 'wineskin':
                let index_w = this.smallItems.indexOf(SmallItem.Wineskin);
                if (index_w > -1) {
                    // Remove wineskin item and replace with half_wineskin
                    this.smallItems.splice(index_w, 1);
                    console.log(this.freeMoves)
                    this.freeMoves++
                    console.log(this.freeMoves)
                    this.pickUpSmallItem(this.region.getID(), SmallItem.HalfWineskin)
                    console.log(this.hk, "has", this.getItemDict());
                }
                break;

            case "half_wineskin":
                let index_hw = this.smallItems.indexOf(SmallItem.HalfWineskin);
                if (index_hw > -1) {
                    this.smallItems.splice(index_hw, 1);
                    console.log(this.freeMoves)
                    this.freeMoves++
                    console.log(this.freeMoves)
                    console.log(this.hk, "has", this.getItemDict());
                }
                break;

            case 'brew':
                let index_brew = this.smallItems.indexOf(SmallItem.Brew);
                if (index_brew > -1) {
                    this.smallItems.splice(index_brew, 1);
                    this.pickUpSmallItem(this.region.getID(), SmallItem.HalfBrew)
                }
                break;

            case 'half_brew':
                let index_hbrew = this.smallItems.indexOf(SmallItem.HalfBrew);
                if (index_hbrew > -1) {
                    this.smallItems.splice(index_hbrew, 1);
                }
                break;

            case 'shield':
                console.log('consuming shield zzzzzzzzzzzzzzzzzzzzzz')
                this.largeItem = LargeItem.DamagedShield
                this.pickUpLargeItem(this.region.getID(), LargeItem.DamagedShield)
                break;

            case 'damaged_shield':
                console.log('consuming damaged shield zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')
                this.largeItem = LargeItem.Empty
                break;

            default:
                console.log('Error! check your spelling on item to consume.')
        }

    }

    public getSmallItems() {
        return this.smallItems
    }

    public assignSmallItem(item: SmallItem) {
        if (this.smallItems.length < 3) {
            this.smallItems.push(item)
            console.log(this.hk, "has", this.getItemDict());
            return true
        }
        else {
            return false
        }
    }

    public pickUpSmallItem(tileID: number, item: SmallItem) {
        if (this.region.getID() != tileID) return false;
        if (this.smallItems.length < 3) {
            this.smallItems.push(item)
            this.region.removeItem(item);
            console.log(this.hk, "has", this.getItemDict());
            return true
        }
        else {
            return false
        }
    }

    public dropSmallItem(item:SmallItem) {
        const index = this.smallItems.indexOf(item);
        if (index > -1) {
            this.region.addItem(this.smallItems[index]);
            this.smallItems.splice(index, 1);
            console.log(this.hk, "has", this.getItemDict());
            return true
        }
        return false;
    }

    public getLargeItem() {
        return this.largeItem
    }

    public pickUpLargeItem(tileID: number, item: LargeItem) {
        if (this.region.getID() != tileID) return false;
        if (this.largeItem == LargeItem.Empty) {
            this.largeItem = item;
            this.region.removeItem(item);
            console.log(this.hk, "has", this.getItemDict());
            return true
        } else {
            return false
        }
    }

    public dropLargeItem() {
        if (this.largeItem != LargeItem.Empty) {
            this.region.addItem(this.largeItem);
            this.largeItem = LargeItem.Empty;
            console.log(this.hk, "has", this.getItemDict());
            return true
        } else {
            return false
        }
    }

    public pickUpHelm(tileID: number) {
        if (this.region.getID() != tileID) return false;
        if (this.helm == false) {
            this.helm = true
            this.region.removeItem("helm");
            console.log(this.hk, "has", this.getItemDict());
            return true
        } else {
            return false
        }
    }

    public dropHelm() {
        if (this.helm == true) {
            this.region.addItem("helm");
            this.helm = false
            console.log(this.hk, "has", this.getItemDict());
            return true
        } else {
            return false
        }
    }

    public deleteSmallItem(item:SmallItem) {
        let index = this.smallItems.indexOf(item);
        if (index > -1) {
            this.smallItems.splice(index, 1);
            console.log('new small items:', this.smallItems)
        }
    }

    public deleteLargeItem() {
        this.largeItem = LargeItem.Empty
    }

    public deleteHelm() {
        this.helm = false
    }

    public addFreeMove(){
        this.freeMoves++
    }
    public getFreeMoves(){
        return this.freeMoves
    }
    //////////////////////
}