import { Tile } from "./tile";
import { game } from "../api/game";

export class Narrator extends Phaser.GameObjects.Image {
    
    private gameController: game;
    // let 1 be A. each advance is represented as an incrementation. B=2, C=3, ..., N = 14
    private positionOfNarrator: number = 1;

    //initialize at A x= 9450, y=6100 
    private x = 9450
    private y = 6100

    constructor(scene: Phaser.Scene, inputX: number, inputY: number, texture: string, gameController: game) {
        super(scene, inputX, inputY, texture);        
        this.gameController = gameController;

        this.setInteractive();
        var self = this;

    }

    public advance() {
        if (this.positionOfNarrator === 13) {
            // cannot advance any more. end game. 
            // check if player wins(witch's brew at castle && THE monster is defeated)
        }

        else {

            this.positionOfNarrator += 1
            // to move to the next place, subtract y by 455
            // at N (last place), y = 185 = 6100 - (12*455)
            this.y -= 455
            //this.setDisplayOrigin(x * scaleFactor + borderWidth, y * scaleFactor + borderWidth)
        }
    }

             
}