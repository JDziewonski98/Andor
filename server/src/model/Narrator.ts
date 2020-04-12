import { SmallItem } from './SmallItem';

export enum enumPositionOfNarrator {
    'X' = -1, // "Setup" phase: displaying story and instruction to clients at start of game
    'A' = 0,
    'B' = 1,
    'C' = 2,
    'D' = 3,
    'E' = 4,
    'F' = 5,
    'G' = 6,
    'H' = 7,
    'I' = 8,
    'J' = 9,
    'K' = 10,
    'L' = 11,
    'M' = 12,
    'N' = 13
};

export class Narrator {
    private legendPosition: number;
    private runestoneLegendPos: number = -1;
    // List of objects {tileID: runestone string}
    private initialRunestoneLocs: Object[] = [];

    constructor(legendPosition: number = 0) {
        this.legendPosition = legendPosition;
    }

    public getLegendPosition() {
        return this.legendPosition;
    }

    public randomInteger(min, max) : number { // min and max are inclusive
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public setRunestoneLegendPos() {
        // A5 decide when RuneStones come into play
        const outcome = this.randomInteger(1, 6)
        switch (outcome) {
            case 1:
                this.runestoneLegendPos = 1;
                break;
            case 2:
                this.runestoneLegendPos = 3;
                break;
            case 3:
                this.runestoneLegendPos = 4;
                break;
            case 6:
                this.runestoneLegendPos = 7;
                break;
            default:
                this.runestoneLegendPos = 5
        }
        return this.runestoneLegendPos;
    }

    public getRunestoneLegendPos() {
        return this.runestoneLegendPos;
    }
    
    public advance() : number {
        this.legendPosition += 1
        return this.legendPosition;
    }

    public setRunestoneLocations() {
        let choice = this.randomInteger(0, 2);
         // Add 5 of the 6 runestones, one of the runestones is randomly removed
        let stones = [SmallItem.YellowRunestoneH, SmallItem.BlueRunestoneH, SmallItem.GreenRunestoneH,
            SmallItem.YellowRunestoneH, SmallItem.BlueRunestoneH, SmallItem.GreenRunestoneH]
        stones.splice(choice, 1);
        for (var i = 0; i < 5; i++) {
            // Generate random 2 digit integer between 11 and 66 for tile placement
            let pos = this.randomInteger(1, 6) * 10 + this.randomInteger(1, 6);
            let stoneObj = {};
            stoneObj[""+pos] = stones[i];
            this.initialRunestoneLocs.push(stoneObj);
        }
    }

    public getRunestoneLocations() {
        return this.initialRunestoneLocs;
    }

    //TODO
    public checkEndGame(): boolean {
        return true;
    }

}

/*
 not sure of best way to implement which card. should this be part of fog even?
 witch card:

Story:
"Finally! There in the fog, one of the heroes discovers the witch named Reka"

*** The hero who uncovered the witch under the fog gets a free brew.
* Place a witch on this space.
* Any hero in the same space as the witch can buy a brew. Archer pays 1 less coin.
* The price is (number of heroes + 1)
* in a battle, the brew doubles the value of 1 die. 1 brew can be used twice

Story:
"Reka knows where to find the medicinal herb to heal the king"

*** Roll die to determine the position of medicinal herb:
 * 1 or 2  -> medicinal herb on 37
 * 3 or 4 -> on 67
 * 5 or 6 -> on 61
 *
 * add a gor to the same space as the herb.
 * Gor must be defeated before the herb can be picked up
 * Gor carries the herb as it moves on sunrise
  
  
 */