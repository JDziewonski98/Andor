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
    private posNarrator: number;
    private triggerRunestone: string;


    constructor(scene: Phaser.Scene, posNarrator: number, texture: string, gameController: game, whereToTriggerAddRune: string = null) {

        // y coordinate varies. y=6100 is the initial y-coordinate. 455 is the amount the image moves upwards
        var inputY = (6100 - (posNarrator * 455)) * scaleFactor + borderWidth

        // x coordinate of narrator image is a constant: (9450 * scaleFactor + borderWidth)
        super(scene, narratorXCoord, inputY, texture);
        this.gameController = gameController;
        // this.setInteractive();        
        this.posNarrator = posNarrator;

    }


    public advance() {
        var self = this;

        this.gameController.advanceNarrator(function (newLegendPos: number) {
            if (enumPositionOfNarrator[(this.posNarrator)] !== "N") {
                /*// cannot advance any more. end game. 
                self.posNarrator += 1
                var inputY = ((6100 - (self.posNarrator * 455)) * scaleFactor) + borderWidth
                // this updates the position of narrator image    */
                self.posNarrator = newLegendPos
                self.y = ((6100 - (self.posNarrator * 455)) * scaleFactor) + borderWidth
            }


        }
        );


        this.gameController.updateNarrator(function (newLegendPos: number) {
            /*if (enumPositionOfNarrator[(this.posNarrator)] !== "N") {
                *//*// cannot advance any more. end game. 
            self.posNarrator += 1
            var inputY = ((6100 - (self.posNarrator * 455)) * scaleFactor) + borderWidth
            // this updates the position of narrator image    *//*
            self.posNarrator = newLegendPos
            self.y = ((6100 - (self.posNarrator * 455)) * scaleFactor) + borderWidth
        }*/


        });


    }

}

    /*public advance() {
        console.log(enumPositionOfNarrator[(this.posNarrator)])
        var self = this;

        if (enumPositionOfNarrator[(this.posNarrator)] === "N") {
                // cannot advance any more. end game. 
    
            }

        else {

            switch (enumPositionOfNarrator[(this.posNarrator)]) {

                case "B": {
                    this.B();
                    break;
                }

                case "C": {
                    this.C();
                    break;
                }

                case "D": {
                    this.D();
                    break;
                }

                case "E": {
                    this.E();
                    break;
                }

                case "F": {
                    this.F();
                    break;
                }

                case "G": {
                    this.G();
                    break;
                }
                case "H": {
                    this.H();
                    break;
                }
                case "I": { break; } // no narrator-related events will occur onward until N
                case "J": { break; }
                case "K": { break; }
                case "L": { break; }
                case "M": { break; }

            }

            this.posNarrator += 1

            // to move the narrator image to the next place, subtract y by 455
            // for example, at B (second place), y = 6100 - (1*455)
            var inputY = ((6100 - (this.posNarrator * 455)) * scaleFactor) + borderWidth
            // console.log("new x, y coordinate: ", narratorXCoord ,inputY)

            // console.log(this) // Narrator object
            // this updates the position of narrator image            
            this.y = inputY

        }
    }*/


     


