import { GameDifficulty } from "./GameDifficulty"
import { RietburgCastle } from "./RietburgCastle"
import { Farmer } from "./Farmer"
import { Region } from "./region"

export class Game {
    private numOfDesiredPlayers: number;
    private difficulty: GameDifficulty;
    private castle: RietburgCastle;

    constructor(numOfDesiredPlayers: number, difficulty: GameDifficulty, castle: RietburgCastle){
        this.numOfDesiredPlayers = numOfDesiredPlayers;
        this.difficulty = difficulty;
        this.castle = castle;
    }

    public removeFarmer(f: Farmer){
        //TO BE IMPLEMENTED
    }

    public getPlayerCount(){
        return this.numOfDesiredPlayers
    }
    public incrementPlayers(){
        this.numOfDesiredPlayers = this.numOfDesiredPlayers + 1
    }

    private endGame(){
        //TO BE IMPLEMENTED
    }

    private checkMonsterInRietburg(){
        //TO BE IMPLEMENTED
    }

    private checkForFarmer(tile: Region){
        //TO BE IMPLEMENTED
    }

    private checkHeroOnWellTile(){
        //TO BE IMPLEMENTED
    }

    private replenishWell(){
        //TO BE IMPLEMENTED
    }

    private incrementNarratorPosition(){
        //TO BE IMPLEMENTED
    }

}