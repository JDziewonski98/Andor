import { MonsterKind } from './MonsterKind';

export class Monster {

    private strength: number = 0;
    private willpower: number = 0;
    private dice = 'red';
    private type: MonsterKind;
    private tileID: number;
    //reward amount of gold and willpower are always same.
    private gold: number = 0;
    public name;
    private base_will: number = 0;

    constructor(kind: MonsterKind, tile: number, numplayers: number = 0, name: string) {
        this.name = name
        this.type = kind;
        this.tileID = tile;
        switch (kind) {
            case "gor":
                this.strength = 2;
                this.willpower = 4;
                this.gold = 2;
                this.base_will = 4;
                break;
            case "skral":
                this.strength = 6;
                this.willpower = 6;
                this.gold = 4;
                this.base_will = 6;
                break;
            case "wardrak":
                this.strength = 10;
                this.willpower = 7;
                this.gold = 6;
                this.dice = 'black'
                this.base_will = 10;
                break;
            case "fortress":
                this.willpower = 6;
                this.base_will = 6
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

    public getTileID() {
        return this.tileID;
    }

    public setTileID(num: number) {
        this.tileID = num;
    }

    public resetWill() {
        this.willpower = this.base_will;
    }

    public rollDice() {
        var attack = 0;

        if (this.dice == 'red') {
            
            if (this.willpower < 7) {
                var dicefaces = [1, 2, 3, 4, 5, 6]
                var roll1 = dicefaces[Math.floor(Math.random() * dicefaces.length)]
                var roll2 = dicefaces[Math.floor(Math.random() * dicefaces.length)]
                if (roll1 == roll2) {
                    attack = roll1 * 2;
                }
                else {
                    attack = (roll1 > roll2) ? roll1 : roll2;
                }
                return attack + this.strength
            }

            else if (this.willpower > 6 && this.willpower < 14) {
                //TODO...
            }

        }

        //black dice
        else if (this.dice == 'black') {

            if (this.willpower < 7) {
                var dicefaces = [6, 6, 8, 10, 10, 12]
                var roll1 = Math.floor(Math.random() * dicefaces.length)
                var roll2 = Math.floor(Math.random() * dicefaces.length)
                if (roll1 == roll2) {
                    attack = roll1 * 2;
                }
                else {
                    attack = (roll1 > roll2) ? roll1 : roll2;
                }
                return attack + this.strength
            }

            else if (this.willpower > 6 && this.willpower < 14) {
                //TODO...
            }

        }
        return attack + this.strength
    }
}