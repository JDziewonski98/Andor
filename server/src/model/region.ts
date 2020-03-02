import { Monster } from '.';

export class Region {
    public adjRegionsIds: number[] = [];
    public nextRegionId: number;
    public id: number;
    // public heroexist: boolean = false;
    //public x: number;
    //public y: number;
    // private graphic;
    // public currHero: Hero;
    // private fog: Fog;
    private gold;
    // private wineskins: Wineskin[] = [];
    // private farmers: Farmer[] = [];
    private hasWell;
    private hasMerchant;
    private wellUsed: boolean = false;
    private currMonster: Monster;
    
    constructor(id, hasWell, monster, nextRegion, adjRegions, hasMerchant) {
        this.id = id;
        //this.x = x;
        //this.y = y;
        // this.hero = null;
        this.hasWell = hasWell;
        this.hasMerchant = hasMerchant;
        this.nextRegionId = nextRegion;
        this.adjRegionsIds = adjRegions;
        // this.currHero = hero;
        this.currMonster = monster;
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

    // public removeFarmer() {
    //     this.farmers = [];
    // }
    // public addFarmer(f: Farmer) {
    //     this.farmers.push(f);
    // }
}