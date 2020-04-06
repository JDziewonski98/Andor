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

    constructor(scene: Phaser.Scene, posNarrator: number, texture: string, gameController: game) {
        
        // y coordinate varies. y=6100 is the initial y-coordinate. 455 is the amount the image moves upwards
        var inputY = (6100 - (posNarrator * 455)) * scaleFactor + borderWidth
        
        // x coordinate of narrator image is always 9450
        console.log(narratorXCoord, inputY)
        super(scene, narratorXCoord, inputY, texture);        
        this.gameController = gameController;       

        this.setInteractive();
        var self = this;

        this.posNarrator = posNarrator

        console.log(this.posNarrator)

    }

    private randomInteger(min, max) { // min and max are inclusive
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private placeRunestoneOnBoard(gameController: game, tileId: number) { // TODO: implement this
        console.log("the tile to place a runestone: ", tileId)
    }

    private addRunestone() { 
            /*
        Runestones (easy)

        *** Place a gor on space 43. a skral on 39
        * Roll 2 dice. outcome represents tens and ones place of the tile to place a rune stone face down.
        * repeat until 5 runestones are in the game
        * more than 1 rune stone may be on same space
        * like fog, you can use a telescope on it. but can't uncover it when just passing through a space
        * runestones can also be uncovered when a monster is on the same space as the runestone
        * if a hero has 3 diffferent-coloured rune stones, he can use the black die in a battle (faces: 6,6,8,10,10,12)
        * wizard can use his ability on a black die

        */
        var self = this;
        for (var i = 0; i < 5; i++) { // this is working. random 2 digit integer between 11 and 66 is correctly generated
            this.placeRunestoneOnBoard(self.gameController, (self.randomInteger(1, 6) * 10) + self.randomInteger(1, 6))
        }

        // Place a gor on space 43. a skral on 39
        //self.gameController.addMonster(43, "gor", "gor43")
        //self.gameController.addMonster(39, "skral", "skral39")

    }

    public advance() {
        console.log(enumPositionOfNarrator[(this.posNarrator)])
        var self = this;

        if (enumPositionOfNarrator[(this.posNarrator)] === "N") {
            // cannot advance any more. end game. 

            /*
            Legend Goal:
            The Legend is won when at "N," all of the following are true:
            1) the castle is defended
            2) medicinal herb is on the castle space
            3) the skral on the tower has been defeated
            
            Story if win:
            "With their combined powers, the heroes were able to take the skral's stronghold.
            The medicinal herb did its work as well, and King Brandur soon felt better.
            And yet, the heroes still feld troubled.
            The king's son, Prince Thorald, had not yet returned.
            What was keeping him so long?
            In the next Legend, you will find out."

            "Story" if lose:
            "Tips for next time:
            + Articles such as the falcon and telescope can be very helpful
            + Prince Thorald's extra strength can help in a battle against skrals
            + It's very important to find the witch quickly
            + To save time, it is sometimes better for one hero to get the entire reward in gold.
            Then just one hero has to het to the merchant
            
            "
            */
        }

        else {

            switch (enumPositionOfNarrator[(this.posNarrator)]) {

                case "A": {
                    
                    /*
                        A1 & A2 - description of the game. (move, fight, free action, easy/hard mode)
                        ===============================================================
                        A3 (easy)

                        story: 
                        "A gloomy mood has fallen upon the people. 
                        Rumors are making the rounds that skrals have set up a stronghold in some undiscovered location. 
                        The heroes have scattered themselves across the entire land in search of this location. 
                        The defense of the castle is in their hands alone.

                        Many farmers have asked for help and are seeking shelter behind the high walls of Rietburg Castle"
                    
                        *** place dwarf on 7, warrior on 14, archer on 25, wizard on 34

                        *** place gors on spaces 8, 20, 21, 26, 48
                        *** place skral on space 19

                        *** place farmer on space 24 & 36
                     
                        ===============================================================
                        A4 - description about famer.
                     
                        story:
                        "At first sunlight, the heroes receive a message: 
                        Old King Brandmur's willposer seems to have weakened with the passage of time. 
                        But there is said to be a herb growing in the mountain passes that can revive a person's life."

                        Task:
                        "The heroes must heal the king with the medicinal herb.
                        To do that, they must find the witch. 
                        Only she know the locations where this herb grows.
                        The witch is hiding behind one of the fog tokens."

                        ===============================================================
                        A5 - description of fog
                        1) when hero enters a space with fog showing the witch's brew, "The Witch" card is uncovered and read.
                        2) gors are under two of the fog tokens. when uncovered, gors a placed on that tile

                        *** Decide when "The Rune Stones" Legend card comes into play
                        Roll Dice. place "The Rune Stones Legend" card as shown below 
                        1 -> B
                        2 -> D
                        3 -> E
                        4 -> F
                        5 -> F (not a typo)
                        6 -> H
                        It is read when narrator arrives at respective positions.
                        

                        From now on, any articles and strength points may be purchased from merchants on spaces 18, 57, 71 for 2 gold each.

                        each hero starts with 2 strength points. The group gets 5 gold and 2 wineskins. collaborative decision.
                        hero with lowest rank begin

                        */



                    // decide when RuneStones come into play
                    const outcome = this.randomInteger(1, 6)
                    if (outcome === 1) { this.triggerRunestone = "B"; }
                    else if (outcome === 2) { this.triggerRunestone = "D"; }
                    else if (outcome === 3) { this.triggerRunestone = "E"; }
                    else if (outcome === 4 || outcome === 5) { this.triggerRunestone = "F"; }
                    else {this.triggerRunestone = "H"}

                    //console.log(this.triggerRunestone) //make sure this works. it does

                    break;
                }

                case "B": {
                    if (this.triggerRunestone === "B") {
                        this.addRunestone()                        
                    }
                    break;
                } 

                case "C": {
                    /*
                     C1 (easy)
                     
                     Story:
                     "The king's scouts have discovered the skral stronghold"

                     *** add 50 to the outcome of a roll die. place skral stronghold on this space.
                     * if there is a monster on that space, remove that monster from game
                     * this skral doesn't move at sunrise. monsters moving into this space is advanced to the next space
                     * this skral has 6 willposer and strength point depending on the number of players:
                     * 2 heroes = 10
                     * 3 heores = 20
                     * 4 heroes = 30
                     
                     Task:
                     The skral on the tower must be defeated. As soon as he is defeated, the Narrator is advanced to "N" of the Legend track

                     Story:
                     "And there's more unsettling news:
                     Rumours are circulating about cruel wardraks from the south.
                     They have not yet been sighted, but more and more farmers are losing their courage, 
                     leaving their farmsteads, and seeking safety in the castle"

                    *** Place a farmer on space 28
                    

                    ===============================================================

                    C2
                    
                    *** Place gors on 27 and 31. Place a skral on 29

                    story:
                    "But there's good newsd from the south too:
                    Prince Thorald, just back from a battle on the edge of the southern forest, is preparing himself to help the heroes."
                     

                    *** Place Prince Thorald on space 72. 
                    * If the prince stands on the same tile as creature, add 4 strength points for the heroes in a battle
                    * Instead of fighting or moving, a hero can "move prince." Costs 1 hr on the time track
                    * after the "move prince" action, it is the next hero's turn
                    * Prince Thorald cannot collect tokens or move farmers
                    * Prince Thorald is present in the game until "G"
                     
                    Legend Goal:
                    The Legend is won when at "N,"
                    1) the castle is defended
                    2) medicinal herb is on the castle space
                    3) the skral on the tower has been defeated
                     
                     */

                    // C2 add gors on 27 and 31. add skral on 29
                    /*self.gameController.addMonster(27, "gor", "gor27");
                    self.gameController.addMonster(31, "gor", "gor31");
                    self.gameController.addMonster(29, "skral", "skral29");
                    */
                    // error. problem with importing???
                    break;
                }

                case "D": {
                    if (this.triggerRunestone === "D") {
                        this.addRunestone()                        
                    }
                    break;
                }

                case "E": {
                    if (this.triggerRunestone === "E") {
                        this.addRunestone()                   
                    }
                    break;
                }

                case "F": {
                    if (this.triggerRunestone === "F") {
                        this.addRunestone()
                    }
                    break;
                }

                case "G": {
                    /*
                     Story:
                     "Prince Thorald joins up with a scouting patrol with the intention of leaving for just a few days.
                     But he is not to be seen again for quite a long time."

                     *** remove Prince Thorald from game
                     
                     Story:
                     "Black shadows are moving in the moonlight.
                     The rumors were right- the wardraks are coming!"

                     *** Place wardraks on space 26 & 27
                     * A wardrak has 10 strength and 7 willpower, and uses 2 black dice in battle
                     * black die faces: 6,6,8,10,10,12
                     * Identical dice values are added.
                     * If a wardrak has less than 7 willpower, it can only use 1 black die.
                     * A wardrak moves twice per sunrise, 1 space per move
                     * Upon defeat, heroes gain 6 gold or 6 willpower, or some combination summing to 6


                     */
                    break;
                }
                case "H": {
                    if (this.triggerRunestone === "B") {
                        this.addRunestone()                      
                    }
                    break;
                } 
                case "I": { break;} // no narrator-related events will occur onward until N
                case "J": { break;}
                case "K": { break;}
                case "L": { break;}
                case "M": { break;}
                
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
    }

             
}




/*
 not sure of best way to implement which card
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


