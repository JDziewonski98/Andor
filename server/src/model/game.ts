import { GameDifficulty } from "./GameDifficulty"
import { RietburgCastle } from "./RietburgCastle"
import { Farmer } from "./Farmer"
import { Region } from "./region"
import { Player } from "./player"
import { Hero } from "./hero"
import { HeroKind } from './HeroKind'
// import { map as tilesData } from "./tilemap"

export class Game {

    private numOfDesiredPlayers: number;
    private difficulty: GameDifficulty;
    private castle: RietburgCastle;
    private players: Set<Player>;
    private name: string;
    private chatlog: any;
    private heroList: Map<string, Hero>;
    private regions: Array<Region>;

    constructor(name: string, numOfDesiredPlayers: number, difficulty: GameDifficulty) {
        this.name = name;
        this.numOfDesiredPlayers = numOfDesiredPlayers;
        this.difficulty = difficulty;
        this.castle = new RietburgCastle();
        this.chatlog = [];
        this.players = new Set<Player>();
        this.heroList = new Map<string, Hero>();
        this.regions = new Array();
        this.setRegions();
    }

    private setRegions() {
        // Note that regions 73-79 and 83 are unused, but created anyways to preserve direct
        // indexing between regions array and region IDs
        var tilesData = require("./tilemap").map;
        var currTileData;
        for (currTileData of tilesData) {
            var r = new Region(currTileData.id, currTileData.hasWell, null, currTileData.nextTile, 
                                currTileData.adjacent, currTileData.hasMerchant);
            this.regions.push(r);
        }
        // console.log("regions sanity check:", this.regions);
    }

    public getName(): string {
        return this.name;
    }

    /*
    * Attach player ID to hero if nobody else selected the same HeroType
    * @param id is player socket ID
    * @param heroType
    */
    public bindHero(id: string, heroType: string): boolean {
        // HeroKind h = HeroKind.Archer;
        if (heroType === "archer")
            this.heroList.set(id, new Hero(HeroKind.Archer));
        else if (heroType === "warrior")
            this.heroList.set(id, new Hero(HeroKind.Warrior));
        else if (heroType === "mage")
            this.heroList.set(id, new Hero(HeroKind.Mage));
        else if (heroType === "dwarf")
            this.heroList.set(id, new Hero(HeroKind.Dwarf));
        else
            return false;

        return true;

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