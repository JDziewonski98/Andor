import { Game } from './Game';
//import {Farmer, Region} from "."
import { MonsterKind } from './MonsterKind';

export enum enumPositionOfNarrator {
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
    private triggerRunestone: string | null = null;
    private gameController: Game;

    constructor(gameController: Game, legendPosition: number = 0) {
        this.legendPosition = legendPosition;
        this.gameController = gameController;
    }

    public getLegendPosition() {
        return this.legendPosition;
    }

    private randomInteger(min, max) { // min and max are inclusive
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /*private placeRunestoneOnBoard(gameController: game, tileId: number) { // TODO: implement this
        console.log("the tile to place a runestone: ", tileId)
    }*/

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


        /*var self = this;
        for (var i = 0; i < 5; i++) { // this is working. random 2 digit integer between 11 and 66 is correctly generated
            this.placeRunestoneOnBoard(self.gameController, (self.randomInteger(1, 6) * 10) + self.randomInteger(1, 6))
        }*/

        // Place a gor on space 43. a skral on 39        
        this.gameController.addMonster(MonsterKind.Gor, 43, "gor43")
        this.gameController.addMonster(MonsterKind.Skral, 39, "skral39")
    }


    ///////////////A to H///////////////

    // A

    private A() {
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

        // A3 place monsters
        this.gameController.addMonster(MonsterKind.Gor, 8, 'gor1');
        this.gameController.addMonster(MonsterKind.Gor, 20, 'gor2');
        this.gameController.addMonster(MonsterKind.Gor, 21, 'gor3');
        this.gameController.addMonster(MonsterKind.Gor, 26, 'gor4');
        this.gameController.addMonster(MonsterKind.Gor, 48, 'gor5');
        this.gameController.addMonster(MonsterKind.Skral, 19, 'skral1');

        // A3 place farmers
        


        // A5 decide when RuneStones come into play
        const outcome = this.randomInteger(1, 6)
        if (outcome === 1) { this.triggerRunestone = "B"; }
        else if (outcome === 2) { this.triggerRunestone = "D"; }
        else if (outcome === 3) { this.triggerRunestone = "E"; }
        else if (outcome === 4 || outcome === 5) { this.triggerRunestone = "F"; }
        else { this.triggerRunestone = "H" }

    }


    private B() {
        if (this.triggerRunestone === "B") {
            this.addRunestone()
        }

    }

    private C() {
        /*
                     C1 (easy)
                    
                     Story:
                     "The king's scouts have discovered the skral stronghold"
    
                     *** add 50 to the outcome of a roll die. place skral stronghold on this space.
                     * if there is a monster on that space, remove that monster from game
                     * this skral doesn't move at sunrise. monsters moving into this space is advanced to the next space
                     * this skral has 6 willpower and strength point depending on the number of players:
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


        // C1 add fortress_skral
        this.gameController.addMonster(MonsterKind.Fortress, (50 + this.randomInteger(1,6)), "fortressSkral")

        // C2 add gors on 27 and 31. add skral on 29       
        this.gameController.addMonster(MonsterKind.Gor, 27, "gor27")
        this.gameController.addMonster(MonsterKind.Gor, 31, "gor31")
        this.gameController.addMonster(MonsterKind.Skral, 29, "skral29")

        // C2 place a farmer on 28
        
    }

    private D() {
        if (this.triggerRunestone === "D") {
            this.addRunestone()
        }
    }

    private E() {
        if (this.triggerRunestone === "E") {
            this.addRunestone()
        }
    }

    private F() {
        if (this.triggerRunestone === "F") {
            this.addRunestone()
        }
    }


    private G() {
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
    }

    private H() {
        if (this.triggerRunestone === "H") {
            this.addRunestone()
        }
    }
    /////////////end of A to H/////////////

    public advance() {
        
        this.legendPosition += 1
               
        switch (enumPositionOfNarrator[(this.legendPosition)]) {
            case "A": { this.A(); break; }
            case "B": { this.B(); break; }
            case "C": { this.C(); break; }
            case "D": { this.D(); break; }
            case "E": { this.E(); break; }
            case "F": { this.F(); break; }
            case "G": { this.G(); break; }
            case "H": { this.H(); break; }
            case "I": { break; } // no narrator-related events will occur onward until N
            case "J": { break; }
            case "K": { break; }
            case "L": { break; }
            case "M": { break; }
        }
        
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