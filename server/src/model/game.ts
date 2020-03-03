import { GameDifficulty } from "./GameDifficulty"
import { RietburgCastle } from "./RietburgCastle"
import { Farmer } from "./Farmer"
import { Region } from "./region"
import { Monster } from './monster';

export class Game {
    
    private numOfDesiredPlayers: number;
    private difficulty: GameDifficulty;
    private castle: RietburgCastle;
    private name: string;
    private chatlog: any;
    private regions: Region[] = [];

    constructor(name: string, numOfDesiredPlayers: number, difficulty: GameDifficulty){
        // console.log("Server game constructor");
        this.name = name;
        this.numOfDesiredPlayers = numOfDesiredPlayers;
        this.difficulty = difficulty;
        this.castle = new RietburgCastle();
        this.chatlog = [];
        this.regions = [];
        this.setRegions();
    }

    private setRegions() {
        // Note that regions 73-79 and 83 are unused, but created anyways to preserve direct
        // indexing between regions array and region IDs
        var tilesData = require("./tilemap").map;
        this.regions = JSON.parse(JSON.stringify(tilesData));
        // console.log("regions sanity check:", this.regions);
    }

    public getName(): string {
        return this.name;
    }

    public removeFarmer(f: Farmer){
        //TO BE IMPLEMENTED
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

    public pushToLog(item) {
        this.chatlog.push(item)
    }

    public getChatLog() {
        return this.chatlog;
    }
}