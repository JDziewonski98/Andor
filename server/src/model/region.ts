import { Monster, Farmer } from '.';
import { LargeItem } from './LargeItem'
import { SmallItem } from './SmallItem'

export class Region {
    private adjRegionsIds: Array<number>;
    private nextRegionId: number;
    private id: number;
    private gold;
    private farmers: Array<Farmer>;
    private hasWell: boolean;
    private hasMerchant: boolean;
    private wellUsed: boolean = false;
    private curMonster!: Monster | null;
    private xcoord: number;
    private ycoord: number;

    // Items, or maybe it's easier with a single list of itemIDs, since we don't actually
    // care how they're used/how they're different functionally
    // private wineskins: number = 0;
    // private largeItems: Map<LargeItem, number> = new Map();
    // private helms: number = 0;
    // private smallItems: Map<SmallItem, number> = new Map();

    public items: Map<string, number> = new Map();
    
    constructor(id: number, x: number, y: number, gold:number, nextRegion: number, adjRegions: Array<number>, hasWell: boolean = false, wellUsed: boolean = false, hasMerchant: boolean = false, items = new Map()) {
        this.xcoord = x;
        this.ycoord = y;
        this.id = id;
        this.hasWell = hasWell;
        this.wellUsed = wellUsed;
        this.hasMerchant = hasMerchant;
        this.nextRegionId = nextRegion;
        this.adjRegionsIds = adjRegions;
        this.farmers = new Array();
        this.gold = gold;
        
        this.items = items;
    }

    public setGold(amount: number) {
        this.gold = amount;
    }
    public getGold() {
        return this.gold;
    }

    public getHasWell() {
        return this.hasWell
    }

    public getWellUsed() {
        return this.wellUsed
    }

    public setWellUsed(boolean) {
        this.wellUsed = boolean
    }

    // public getFog() {
    //     return this.fog;
    // }

    //deviates from design class diagrma
    public setMonster(m: Monster | null) {
        this.curMonster = m;
    }
    public getMonster() {
        return this.curMonster;
    }

    public getMerchant(){
        return this.hasMerchant;
    }
    public setHasMerchant(b){
        this.hasMerchant = b
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
         this.farmers.pop();
    }

    public removeAllFarmers() {
        this.farmers = [];
    }

    public addFarmer(f: Farmer) {
        this.farmers.push(f);
    }

    public getAdjRegionsIds(): number[]{
        return this.adjRegionsIds
    }
    public removeWell(){
        this.hasWell = false
    }

    /*
    *   ITEM METHODS
    */
    public addItem(itemName: string) {
        if (this.items.has(itemName)) {
            let newQuantity = this.items.get(itemName);
            if (newQuantity != null) {
                this.items.set(itemName, newQuantity+1);
            }
        } else {
            this.items.set(itemName, 1);
        }
        console.log(this.id, "has", this.getItems());
    }

    public removeItem(itemName: string) {
        // this.items.set('wineskin', 4);
        if(!this.items.has(itemName)) return;

        let quantity = this.items.get(itemName)
        if (quantity != undefined && quantity > 1) {
            this.items.set(itemName, quantity - 1);
        } else {
            this.items.delete(itemName);
        }
        console.log(this.id, "has", this.getItems());
    }

    public getItems() {
        let itemsObject = {};
        this.items.forEach((val: number, key: string) => {
            itemsObject[key] = val;
        });
        return itemsObject;
    }
}