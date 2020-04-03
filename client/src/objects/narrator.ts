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
    
    private gameController: game;
    // let 0 be A. each advance is represented as an incrementation. B=2, C=3, ..., N = 14
    private posNarrator: number
    

    constructor(scene: Phaser.Scene, posNarrator: number, texture: string, gameController: game) {
        
        // y coordinate varies. y=6100 is the initial y-coordinate. 455 is the amount the image moves upwards
        var inputY = (6100 - (posNarrator * 455)) * scaleFactor + borderWidth
        
        // x coordinate of narrator image is always 9450
        super(scene, narratorXCoord, inputY, texture);        
        this.gameController = gameController;       

        this.setInteractive();
        var self = this;

        this.posNarrator = posNarrator
        

    }

    public advance() {

        if (enumPositionOfNarrator[(this.posNarrator)] === "A") {
            // at beginning of game. position A
            console.log("narrator at A")

            // at end of this case
            this.posNarrator += 1
            
        }
        else if (enumPositionOfNarrator[(this.posNarrator)] === "N") {
            // cannot advance any more. end game. 
            // check if player wins(witch's brew at castle && THE monster is defeated)
        }

        else {

            this.posNarrator += 1
            // to move to the next place, subtract y by 455
            // at N (last place), y = 185 = 6100 - (12*455)
            //inputY = (6100 - (this.posNarrator * 455)) * scaleFactor + borderWidth
            //this.Phaser.GameObjects.Image.setDisplayOrigin(x * scaleFactor + borderWidth, y * scaleFactor + borderWidth)


            switch (enumPositionOfNarrator[(this.posNarrator)]) {
                
                case "B": { }
                case "C": { }
                case "D": { }
                case "E": { }
                case "F": { }
                case "G": { }
                case "H": { }
                case "I": { }
                case "J": { }
                case "K": { }
                case "L": { }
                case "M": { }               
                
            }
        }
    }

             
}