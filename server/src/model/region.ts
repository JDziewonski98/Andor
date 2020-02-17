class Region {
    public adjacentRegions: Region[] = [];
    nextRegion: Region;
    public id: number;
    // public heroexist: boolean = false;
    public x: number;
    public y: number;
    // private graphic;
    // public currHero: Hero;
    // private fog: Fog;
    private gold;
    // private wineskins: Wineskin[] = [];
    // private farmers: Farmer[] = [];
    private hasWell;
    private wellUsed: boolean = false;
    private currMonster: Monster;
    
    constructor(id, x, y, hasWell, monster, nextRegion) {
        this.id = id;
        this.x = x;
        this.y = y;
        // this.hero = null;
        this.hasWell = hasWell;
        // this.currHero = hero;
        this.currMonster = monster;
        this.nextRegion = nextRegion;
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

    public getNextRegion() {
        return this.nextRegion;
    }

    // public removeFarmer() {
    //     this.farmers = [];
    // }
    // public addFarmer(f: Farmer) {
    //     this.farmers.push(f);
    // }
}