import { GameDifficulty } from "./GameDifficulty"
import { RietburgCastle } from "./RietburgCastle"
import { Farmer } from "./Farmer"
import { Region } from "./region"
import { Player } from "./player"
import { Hero } from "./hero"

export class Game {

    private numOfDesiredPlayers: number;
    private difficulty: GameDifficulty;
    private castle: RietburgCastle;
    private players: Set<Player>;
    private name: string;
    private chatlog: any;
    private heroList: Map<string, Hero>;
    private regions: any;

    constructor(name: string, numOfDesiredPlayers: number, difficulty: GameDifficulty) {
        this.name = name;
        this.numOfDesiredPlayers = numOfDesiredPlayers;
        this.difficulty = difficulty;
        this.castle = new RietburgCastle();
        this.chatlog = [];
        this.players = new Set<Player>();
        this.heroList = new Map<string, Hero>();
        this.regions = [];
        this.setRegions();
    }

    private setRegions() {
        // whoever was working on this, make tilemap a js file and export an object from there. Do that instad of importing fs and reading file and parsing..
        let rawdata = require('fs').readFileSync(require('path').resolve('src/model/tilemap.json'));
        let student = JSON.parse(rawdata.toString());
    }

    public getName(): string {
        return this.name;
    }

    public bindHero(id: string, heroType: string) {

    }

    public getNumOfDesiredPlayers(): number {
        return this.numOfDesiredPlayers;
    }
    public getPlayers(): Set<Player> {
        return this.players;
    }

    public addPlayer(p: Player) {
        this.players.add(p);
    }

    public removePlayer(id: string) {
        this.players.forEach((player) => {
            if (player.getID() === id) {
                this.players.delete(player);
                return;
            }
        })
    }

    public removeFarmer(f: Farmer) {
        //TO BE IMPLEMENTED
    }

    private endGame() {
        //TO BE IMPLEMENTED
    }

    private checkMonsterInRietburg() {
        //TO BE IMPLEMENTED
    }

    private checkForFarmer(tile: Region) {
        //TO BE IMPLEMENTED
    }

    private checkHeroOnWellTile() {
        //TO BE IMPLEMENTED
    }

    private replenishWell() {
        //TO BE IMPLEMENTED
    }

    private incrementNarratorPosition() {
        //TO BE IMPLEMENTED
    }

    public pushToLog(item) {
        this.chatlog.push(item)
    }

    public getChatLog() {
        return this.chatlog;
    }
}