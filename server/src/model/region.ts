import { Monster, Farmer } from '.';

export class Region {
    private adjRegionsIds: Array<number>;
    private nextRegionId: number;
    private id: number;
    private gold;
    // private wineskins: Wineskin[] = [];
    private farmers: Array<Farmer>;
    private hasWell: boolean;
    private hasMerchant: boolean;
    private wellUsed: boolean = false;
    private curMonster!: Monster;
    
    constructor(id: number, nextRegion: number, adjRegions: Array<number>, hasWell: boolean = false, hasMerchant: boolean = false) {
        this.id = id;
        this.hasWell = hasWell;
        this.hasMerchant = hasMerchant;
        this.nextRegionId = nextRegion;
        this.adjRegionsIds = adjRegions;
        this.farmers = new Array();
    }

    // public removeHero() {
    //     currHero = null;
    // }

    public setGold(amount: number) {
        this.gold = amount;
    }
    public getGold() {
        return this.gold;
    }

    // public getFog() {
    //     return this.fog;
    // }

    //deviates from design class diagrma
    public setMonster(m: Monster) {
        this.curMonster = m;
    }
    public getMonster() {
        return this.curMonster;
    }

    // public addWineskin(w: Wineskin) {
    //     this.wineskins.push(w);
    // }
    public getID(){
        return this.id;
    }

    public getNextRegionId() {
        return this.nextRegionId;
    }

    public getFarmers(): Array<Farmer>{
        return this.farmers!;
    }

    public removeFarmer() {
         this.farmers = [];
    }
    public addFarmer(f: Farmer) {
        this.farmers.push(f);
    }
}