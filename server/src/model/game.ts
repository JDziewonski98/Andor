import {
    GameDifficulty,
    RietburgCastle,
    Farmer,
    Region,
    Player,
    Hero,
    HeroKind,
    Monster
} from "."
import { MonsterKind } from './MonsterKind';

export class Game {

    private numOfDesiredPlayers: number;
    private difficulty: GameDifficulty;
    private castle: RietburgCastle;
    private players: Set<Player>;
    private name: string;
    private chatlog;
    public readyplayers: number;
    // playerID mapping to Hero.
    private heroList: Map<string, Hero>;
    private regions: Array<Region>;
    private farmers: Array<Farmer>;

    // collab decision related state
    public numAccepts: number;

    private availableHeros: Array<HeroKind> = new Array(HeroKind.Archer, HeroKind.Dwarf, HeroKind.Mage, HeroKind.Warrior);

    constructor(name: string, numOfDesiredPlayers: number, difficulty: GameDifficulty) {
        this.name = name;
        this.numOfDesiredPlayers = numOfDesiredPlayers;
        this.difficulty = difficulty;
        this.castle = new RietburgCastle();
        this.chatlog = [];
        this.players = new Set<Player>();
        this.heroList = new Map<string, Hero>();
        this.regions = new Array<Region>();
        this.farmers = new Array<Farmer>();
        this.setRegions();
        this.setFarmers();
        this.setMonsters()
        this.readyplayers = 0;

        this.numAccepts = 0;
    }

    private setFarmers() {
        //this.regions[24].initFarmer()
        this.farmers.push(new Farmer(this.regions[24]));
        this.farmers.push(new Farmer(this.regions[36]));

        this.regions[24].addFarmer(this.farmers[0]);
        this.regions[36].addFarmer(this.farmers[1]);

        console.log(this.regions[36])

    }

    private setMonsters() {
        this.regions[8].setMonster(new Monster(MonsterKind.Gor, 8))
        this.regions[20].setMonster(new Monster(MonsterKind.Gor, 20))
        this.regions[21].setMonster(new Monster(MonsterKind.Gor, 21))
        this.regions[26].setMonster(new Monster(MonsterKind.Gor, 26))
        this.regions[48].setMonster(new Monster(MonsterKind.Gor, 48))
        this.regions[19].setMonster(new Monster(MonsterKind.Skral, 19))
    }

    private setRegions() {
        // Note that regions 73-79 and 83 are unused, but created anyways to preserve direct
        // indexing between regions array and region IDs
        var tilesData = require("./tilemap").map;
        tilesData.forEach(t => {
            this.regions.push(new Region(t.id, t.nextRegionId, t.adjRegionsIds, t.hasWell, t.hasMerchant))
        })
        //console.log(this.regions[2].getNextRegionId())
        // console.log("regions sanity check:", this.regions);
    }
    public getRegions(): Region[] {
        return this.regions
    }
    public getName(): string {
        return this.name;
    }

    /*
    * Attach player ID to hero if nobody else selected the same HeroType
    * @param id is player socket ID
    * @param heroType
    */
    public bindHero(id: string, heroType: HeroKind): boolean {
        // Herokind already been taken
        this.heroList.forEach((hero, key) => {
            if (hero.getKind() === heroType) {
                return false;
            }
        })
        if (heroType === HeroKind.Dwarf) {
            this.heroList.set(id, new Hero(heroType, this.regions[7]));
        }
        else if (heroType === HeroKind.Archer) {
            this.heroList.set(id, new Hero(heroType, this.regions[25]));
        }
        else if (heroType === HeroKind.Mage) {
            this.heroList.set(id, new Hero(heroType, this.regions[34]));
        }
        else if (heroType === HeroKind.Warrior) {
            this.heroList.set(id, new Hero(heroType, this.regions[14]));
        }

        this.availableHeros = this.availableHeros.filter(h => h != heroType);
        return true;

    }

    public getHeros() {
        return this.heroList;
    }

    public getHero(id: string): Hero {
        return this.heroList.get(id)!;
    }

    public getAvailableHeros() {
        return this.availableHeros;
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
        if (this.heroList.has(id)) {
            this.availableHeros.push(this.heroList.get(id)!.getKind())
            this.heroList.delete(id);
        }
    }

    public removeFarmer(f: Farmer) {
        //TO BE IMPLEMENTED
    }

    public moveHeroTo(hero, tile) {
        console.log("Passed method call")
        hero.moveTo(tile)
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
        var region
        var idRegion
        var idRegionOfHero
        var flag = true

        for (region in this.regions) { // for every region
            if (region.getHasWell()) { // if region has a well
                flag = true
                idRegion = region.getID()

                // check there are no heros on this tile
                for (let h of this.heroList.values()) {
                    idRegionOfHero = h.getRegion().getID()

                    if (idRegionOfHero === idRegion) {
                        flag = false //found a hero on well tile
                    }
                }
                //if no one standing on well tile, replenish well
                if (flag) {
                    region.setWellUsed(false)

                    //TODO: inform front-end that a well has been replenished 
                }

            }
        }
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