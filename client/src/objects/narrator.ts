import { Tile } from "./tile";
import { game } from "../api/game";
import {
    borderWidth, scaleFactor, enumPositionOfNarrator, narratorXCoord  
} from '../constants'

// for reference: 
/*export const enum enumPositionOfNarraton {
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
};*/

export class Narrator extends Phaser.GameObjects.Image {
    // let 0 be A. each advance is represented as an incrementation. B=2, C=3, ..., N = 14
    private posNarrator: number;
    private triggerRunestone: number;

    constructor(scene: Phaser.Scene, posNarrator: number, texture: string, gameController: game, whereToTriggerAddRune: string = null) {
        // y coordinate varies. y=6100 is the initial y-coordinate. 455 is the amount the image moves upwards
        var inputY = (6100 - (posNarrator * 455)) * scaleFactor + borderWidth

        // x coordinate of narrator image is a constant: (9450 * scaleFactor + borderWidth)
        super(scene, narratorXCoord, inputY, texture);
        // this.gameController = gameController;
        // this.setInteractive();        
        this.posNarrator = posNarrator;
    }

    // Advance GUI position of the narrator pawn
    public advance() {
        var self = this;

        if (this.posNarrator != 13) {
            self.posNarrator += 1;
            self.y = ((6100 - (self.posNarrator * 455)) * scaleFactor) + borderWidth
        }
    }

    public setRunestonePos(pos: number) {
        this.triggerRunestone = pos;
    }

    public getRunestonePos() : number {
        return this.triggerRunestone;
    }
}
