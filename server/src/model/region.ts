import { Monster, Farmer } from '.';

export class Region {
    public adjRegionsIds: number[] = [];
    public nextRegionId;
    public id;
    // public heroexist: boolean = false;
    //public x: number;
    //public y: number;
    // private graphic;
    // public currHero: Hero;
    // private fog: Fog;
    private gold;
    // private wineskins: Wineskin[] = [];
    private farmers: Array<Farmer>;
    private hasWell;
    private hasMerchant;
    private wellUsed: boolean = false;
    private currMonster;
    
    constructor(id, hasWell, nextRegion, adjRegions, hasMerchant) {
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
        this.currMonster = m;
    }
    public getMonster() {
        return this.currMonster;
    }

    // public addWineskin(w: Wineskin) {
    //     this.wineskins.push(w);
    // }

    public getNextRegionId() {
        return this.nextRegionId;
    }

    public getFarmer(): Array<Farmer>{
        return this.farmers!;
    }

    public removeFarmer() {
         this.farmers = [];
    }
    public addFarmer(f: Farmer) {
        if(this.farmers === undefined){
            this.farmers = new Array();
        }
        this.farmers.push(f);
    }
}