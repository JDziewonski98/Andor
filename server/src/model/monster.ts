import { MonsterKind } from './MonsterKind';

export class Monster {

    private strength: number = 0;
    private willpower: number = 0;
    private dice = 'red';
    private type: MonsterKind;
    private tile: number;
    //reward amount of gold and willpower are always same.
    private gold: number = 0;

    constructor(kind: MonsterKind,tile: number, numplayers: number = 0) {
        this.type = kind;
        this.tile = tile;
        switch (kind) {
            case "gor":
                this.strength = 2;
                this.willpower = 4;
                this.gold = 2;
                break;
            case "skral":
                this.strength = 6;
                this.willpower = 6;
                this.gold = 4;
                break;
            case "wardrak":
                this.strength = 10;
                this.willpower = 7;
                this.gold = 6;
                this.dice = 'black'
                break;
            case "fortress":
                this.willpower = 6;
                this.gold = 4;
                if (numplayers > 0) {
                    this.strength = 10 * numplayers - 10;
                }
                else {
                    console.log("Error while creating fortress: You didn't pass # of players!")
                }
                break;
        }
    }

    public setStrength(num: number) {
        this.strength = num;
    }

    public setWill(num: number) {
        this.willpower = num;
    }

    public getStrength() {
        return this.strength;
    }

    public getWill() {
        return this.willpower;
    }

    public getGold() {
        return this.gold;
    }

    public getType() {
        return this.type;
    }

    public getTile()  {
        return this.tile;
    }

    public setTile(num: number) {
        this.tile = num;
    }
    
}