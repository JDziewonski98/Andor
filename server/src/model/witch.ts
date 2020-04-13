import { Hero } from './hero';
import { SmallItem } from './SmallItem';

export class Witch {
    private tileID: number;
    private numBrews: number;
    private brewPrice: number;

    constructor(tileID: number, brewPrice: number) {
        this.tileID = tileID;
        this.brewPrice = brewPrice;
        this.numBrews = 5;
    }

    public purchaseBrew(hero: Hero) : boolean {
        if (hero.getGold() >= this.brewPrice && this.numBrews > 0 && 
                hero.pickUpSmallItem(hero.getRegion().getID(), SmallItem.Brew)) {
            hero.updateGold(this.brewPrice * -1);
            this.numBrews--;
            return true;
        }
        return false;
    }

    public placeHerb() : number {
        // Roll die to determine space of herb
        let pos = 37;
        let roll = this.randomInteger(1, 6);
        switch (roll) {
            case 1 :
            case 2 :
                pos = 37;
            case 3:
            case 4:
                pos = 67;
            case 5:
            case 6:
                pos = 61;
        }
        return pos;
    }

    public randomInteger(min, max) : number { // min and max are inclusive
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}