import {
    GameDifficulty,
    RietburgCastle,
    Farmer,
    Region,
    Player,
    Hero,
    HeroKind,
    Monster,
    MonsterKind,
    Fog,
    EventCard,
    Prince,
    Narrator,
    Witch
} from "."
import { LargeItem } from './LargeItem';
import { SmallItem } from './SmallItem';

import {
    dFarmers,
    dRegions,
    dMonsters,
    dFogs,
    dEventDeck,
    dCastle,
    // dPrince,
    dNarrator,
    dHeros
} from "./defaults";

export class Game {
    public numOfDesiredPlayers: number;
    public difficulty: GameDifficulty;
    private castle!: RietburgCastle;
    private players: Set<Player>;
    private name: string;
    private chatlog;
    public readyplayers: number;

    // playerID mapping to Hero.
    private heroList: Map<string, Hero>;
    // herokind of heroes who haven't ended their day yet
    private activeHeros: HeroKind[];
    // null when the game first starts
    public nextDayFirstHero: HeroKind | null = null;
    public currPlayersTurn: HeroKind;

    private fogs: Map<number, Fog>;
    private regions: Array<Region>;
    private farmers: Array<Farmer>;
    private monsters: Map<string, Monster>;
    private monstersInCastle: string[];
    private endOfGame: boolean = false;

    public initialCollabDone: boolean = false;
    public runestoneCardPos: number = -1;
    private prince: Prince | null = null;
    private witch: Witch | null = null;

    private narrator!: Narrator;
    public gameStartHeroPosition: number = 1;
    private gameStartMinRank: number = Number.MAX_VALUE;

    // collab decision related state
    public numAccepts: number;
    private availableHeros: Array<Hero>;
    //private availableHeros: Array<HeroKind> = new Array(HeroKind.Archer, HeroKind.Dwarf, HeroKind.Mage, HeroKind.Warrior);

    //EventCards
    private eventDeck: Array<EventCard>;
    private activeEvents: Array<Number>;
    private blockedEvent: boolean;
    constructor(name: string, numOfDesiredPlayers: number, difficulty: GameDifficulty, legendPosition = 0) {
        this.name = name;
        this.numOfDesiredPlayers = numOfDesiredPlayers;
        this.difficulty = difficulty;
        this.chatlog = [];
        this.players = new Set<Player>();
        this.heroList = new Map<string, Hero>();
        this.activeHeros = [];
        this.regions = new Array<Region>();
        this.farmers = new Array<Farmer>();
        this.monsters = new Map<string, Monster>();
        this.monstersInCastle = [];
        this.fogs = new Map<number, Fog>();
        this.eventDeck = new Array<EventCard>()
        this.readyplayers = 0;
        this.numAccepts = 0;
        this.currPlayersTurn = HeroKind.Dwarf;
        this.activeEvents = new Array<number>();
        this.availableHeros = new Array<Hero>();
        this.blockedEvent = false;
        this.initialCollabDone = false;
        this.runestoneCardPos = -1;
        // this.narrator = new Narrator(this, 0)
    }

    /*public initialize(
        currPlayersTurn?,
        regions?,
        farmers?,
        monsters?,
        fogs?,
        heros?,        
        eventDeck?,
        activeEvents?,        
        nextDayFirstHero?,
        activeHeros?,
        castle?,
        monstersInCastle?,
        endOfGameState?,
        prince?,
        narrator?
    ) {
        currPlayersTurn = currPlayersTurn || HeroKind.None;
        regions = regions || dRegions;
        farmers = farmers || dFarmers;
        monsters = monsters || dMonsters;
        fogs = fogs || dFogs();
        heros = heros || [];
        eventDeck = eventDeck || dEventDeck();
        activeEvents = activeEvents || [];
        nextDayFirstHero = nextDayFirstHero || HeroKind.None;
        activeHeros = activeHeros || [];
        castle = castle || dCastle(this.numOfDesiredPlayers);
        monstersInCastle = monstersInCastle || [];
        endOfGameState = endOfGameState || false;
        prince = prince || null; // prince does not exist until legend card C2
        narrator = narrator || dNarrator;


        this.currPlayersTurn = currPlayersTurn;
        this.nextDayFirstHero = nextDayFirstHero;
        this.setRegions(regions);
        // this.setHeros(heros);
        this.setFarmers(farmers);
        this.castle = new RietburgCastle(castle.numDefenseShields, castle.numDefenseShieldsUsed);
        this.setMonsters(monsters);
        this.setFogs(fogs);
        this.setEventDeck(eventDeck);
        this.setActiveEvents(activeEvents);
        this.setActiveHeros(activeHeros);
        this.monstersInCastle = monstersInCastle;
        this.endOfGame = endOfGameState;
        this.narrator = new Narrator(narrator.legendPosition);
    }*/
    public initialize({
        currPlayersTurn = HeroKind.None,
        regions = dRegions,
        farmers = dFarmers,
        monsters = dMonsters,
        fogs = dFogs(),
        heros = dHeros,
        eventDeck = dEventDeck(),
        activeEvents = [],
        nextDayFirstHero = HeroKind.None,
        activeHeros = [],
        castle = dCastle(this.numOfDesiredPlayers),
        monstersInCastle = [],
        endOfGameState = false,
        prince = { tile: { id: -1 } },
        narrator = dNarrator,
        initialCollabDone = false,
        runestoneCardPos = -1,
    }) {
        this.currPlayersTurn = currPlayersTurn;
        this.readyplayers = 0
        this.nextDayFirstHero = nextDayFirstHero;
        this.setRegions(regions);
        this.setAvailableHeros(heros);
        this.setFarmers(farmers);
        this.castle = new RietburgCastle(castle.numDefenseShields, castle.numDefenseShieldsUsed);
        this.setMonsters(monsters);
        this.setFogs(fogs);
        this.setEventDeck(eventDeck);
        this.setActiveEvents(activeEvents);
        this.setActiveHeros(activeHeros);
        this.monstersInCastle = monstersInCastle;
        this.endOfGame = endOfGameState;
        this.narrator = new Narrator(narrator.legendPosition);
        if (prince && prince.tile && prince.tile.id !== -1)
            this.prince = new Prince(this.regions[prince.tile.id])

        this.initialCollabDone = initialCollabDone;
        this.runestoneCardPos = runestoneCardPos;
    }

    private setAvailableHeros(heros) {
        heros.forEach(heroData => {
            this.availableHeros.push(new Hero({
                hk: heroData.hk,
                rank: heroData.rank,
                gold: heroData.gold,
                will: heroData.will,
                strength: heroData.strength,
                dice: heroData.dice,
                timeOfDay: heroData.timeOfDay,
                wineskin: heroData.wineskin,
                largeItem: heroData.largeItem,
                smallItems: heroData.smallItems,
                helm: heroData.helm,
                farmers: heroData.farmers,
                freeMoves: heroData.freeMoves,
                hasMovedThisTurn: heroData.hasMovedThisTurn,
                region: this.regions[heroData.region.id],
                movePrinceCtr: heroData.movePrinceCtr
            }))
        })
    }

    // private setFirstHerosTurn() {
    //     if (this.currPlayersTurn != HeroKind.None) {
    //         // We only set the first hero turn at the start of the game
    //         console.log("not start of game - don't call setFirstHerosTurn")
    //         return;
    //     }
    //     console.log("backend heroList:", this.heroList);
    //     // Set the first turn of the game based on min hero rank
    //     var minRank = Number.MAX_VALUE;
    //     var ID = "none";
    //     for (var socketID in this.heroList) {
    //         var hero = this.heroList[socketID]
    //         if (hero.getRank() < minRank) {
    //             minRank = hero.getRank()
    //             ID = socketID
    //         }
    //     }
    //     console.log("setting first player turn to", this.heroList[ID].getKind());
    //     this.currPlayersTurn = this.heroList[ID].getKind();
    // }

    public getIDsByHeroname(heronames) {
        var heroids: string[] = []
        this.heroList.forEach((hero, ID) => {
            if (heronames.includes(hero.getKind())) {
                heroids.push(ID)
            }
        })
        return heroids
    }

    // endDayAll: boolean. True if nextPlayer is being called by the last hero to end their day,
    //  in this case we pass the next turn to the day's earliest ending player (nextDayFirstHero).
    //  False otherwise, in this case we pass the next turn based on increasing hero rank.
    // Returns HeroKind of the next player
    public nextPlayer(endDayAll: boolean): HeroKind {

        // If the last person is ending their day, pass turn to earliest ending player
        if (endDayAll) {
            if (this.nextDayFirstHero) {
                return this.nextDayFirstHero;
            }
        }
        // If only one hero remaining, then the current hero keeps the turn
        if (this.activeHeros.length == 1) {
            return this.currPlayersTurn;
        }
        // Otherwise, find the hero with the next highest rank
        console.log("server nextplayer: currplayer is", this.currPlayersTurn)
        let currPlayerID = this.getConnIdFromHk(this.currPlayersTurn);
        if (currPlayerID == null) currPlayerID = "none";
        var minRank = this.getHero(currPlayerID).getRank();
        var maxRank = Number.MAX_VALUE;
        var hk = HeroKind.None;
        this.heroList.forEach(hero => {
            if (hero.getRank() > minRank && hero.getRank() < maxRank) {
                maxRank = hero.getRank();
                hk = hero.hk;
            }
        })
        // Or loop back to the lowest rank hero
        if (hk == "none") {
            minRank = Number.MAX_VALUE
            this.heroList.forEach((hero, ID) => {
                if (hero.getRank() < minRank) {
                    minRank = hero.getRank()
                    hk = hero.hk;
                }
            })
        }
        return hk; // None if not found
    }

    public setFarmers(f) {
        f.forEach((farmer) => {
            const farmObj = new Farmer(farmer.id, farmer.tileID);
            this.farmers.push(farmObj)
            this.regions[farmObj.getTileID()].addFarmer(farmObj);
        })
    }

    public killFarmersOnTile(tileID: number) : number {
        let numKilled = this.regions[tileID].getFarmers().length;
        this.regions[tileID].removeAllFarmers();
        return numKilled;
    }

    public killFarmersOfHeroes(tileID: number, hero: Hero | null) : HeroKind[] {
        let heroes: HeroKind[] = [];
        let tile = this.regions[tileID];
        if (hero != null) { // check is for a specific hero moving to new space
            if (tile.getMonster() != null && hero.getFarmers().length > 0) {
                hero.removeAllFarmers();
                heroes.push(hero.getKind());
            }
        } else { // check is for all heroes on tile that a monster is now on
            if (tile.getMonster() != null) {
                this.heroList.forEach(hero => {
                    if (hero.getRegion() === tile && hero.getFarmers().length > 0) {
                        hero.removeAllFarmers();
                        heroes.push(hero.getKind());
                    }
                })
            }
        }
        return heroes;
    }

    public setMonsters(monsters) {
        monsters.forEach(monster => {
            this.addMonster(monster.type, monster.tileID, monster.name);
        })
    }

    // Adds a monster to the next open space on the board, or sends the monster directly to the castle
    // If the latter, return null instead of a Monster.
    public addMonster(kind: MonsterKind, tile: number, id: string): Monster | null {
        var nextRegID = tile;
        if (kind != MonsterKind.Fortress) { // jumping doesn't apply to Fortress
            var shieldsRemaining: number = this.castle.getShields();
            while (this.regions[nextRegID].getMonster()) {
                nextRegID = this.regions[nextRegID].getNextRegionId();
                // base case: the region is tile 0 (the castle)
                if (nextRegID == 0) {
                    // Monster is going to enter the castle
                    // Decrement shields, monster will not get created
                    shieldsRemaining = this.castle.attackOnCastle();
                    break;
                }
            }
            if (this.castle.getShields() <= 0) {
                this.endOfGame = true;
            }
        }
        // Remove any monster that is occupying the Fortress's space
        if (kind == MonsterKind.Fortress) {
            let currMonster = this.regions[nextRegID].getMonster();
            if (currMonster) {
                this.monsters.delete(currMonster.name);
            }
        }

        let monster: Monster | null = null;
        // nextRegID is either 0 (don't create monster) or the correct open tile
        if (nextRegID != 0) {
            monster = new Monster(kind, nextRegID, this.numOfDesiredPlayers, id)
            this.monsters.set(monster.name, monster);
            this.regions[nextRegID].setMonster(monster);
        }

        return monster;
    }

    public setRegions(regions) {
        // Note that regions 73-79 and 83 are unused, but created anyways to preserve direct
        // indexing between regions array and region IDs
        regions.forEach(t => {
            this.regions.push(
                new Region(t.id, t.xcoord, t.ycoord, t.gold, t.nextRegionId, t.adjRegionsIds, t.hasWell, t.wellUsed, t.hasMerchant, t.items)
            )
        })
    }

    public setFogs(fogs: Map<number, Fog>) {
        this.fogs = fogs;
    }

    public getFogs(): Map<number, Fog> {
        return this.fogs;
    }

    public getFarmers(): Array<Farmer> {
        return this.farmers;
    }

    public getPrince(): Prince | null {
        return this.prince;
    }

    public getWitch(): Witch | null {
        return this.witch;
    }

    public getRegions(): Region[] {
        return this.regions
    }

    public getName(): string {
        return this.name;
    }

    public getNarrator(): Narrator {
        return this.narrator;
    }

    /*
    * Attach player ID to hero if nobody else selected the same HeroType
    * @param id is player socket ID
    * @param heroType
    */
   /* public bindHero(id: string, heroType: HeroKind): boolean {
        // Herokind already been taken
        let heroTaken = false;
        this.heroList.forEach((hero, key) => {
            if (hero.getKind() === heroType) {
                heroTaken = true;
            }
        })
        if (heroTaken) return false; // failed to bind hero

        if (heroType === HeroKind.Dwarf) {
            this.heroList.set(id, new Hero(heroType, this.regions[7]));
            //REMOVE before merging to master, used for item testing
            let dwarf = this.heroList.get(id)
            // dwarf?.pickUpLargeItem(dwarf.getRegion().getID(), LargeItem.Bow)
            dwarf?.pickUpSmallItem(dwarf.getRegion().getID(), SmallItem.Telescope)
            
            let dwarf = this.heroList.get(id)
            //dwarf?.pickUpLargeItem(dwarf.getRegion().getID(), LargeItem.DamagedShield)
            // dwarf?.pickUpSmallItem(dwarf.getRegion().getID(), SmallItem.Telescope)
            // dwarf?.pickUpSmallItem(dwarf.getRegion().getID(), SmallItem.Wineskin)
            // dwarf?.pickUpHelm(dwarf.getRegion().getID());
        }
        else if (heroType === HeroKind.Archer) {
            this.heroList.set(id, new Hero(heroType, this.regions[25]));
            //REMOVE before merging to master, used for item testing
            // let archer = this.heroList.get(id)
            // archer?.pickUpSmallItem(archer.getRegion().getID(), SmallItem.Telescope)
            let archer = this.heroList.get(id)
            //archer?.pickUpSmallItem(archer.getRegion().getID(), SmallItem.GreenRunestone)
        }
        else if (heroType === HeroKind.Mage) {
            this.heroList.set(id, new Hero(heroType, this.regions[34]));
        }
        else if (heroType === HeroKind.Warrior) {
            this.heroList.set(id, new Hero(heroType, this.regions[14]));
        }

        this.activeHeros.push(heroType);
        this.availableHeros = this.availableHeros.filter(h => h != heroType);
        return true;

    }*/
    public bindHero(id: string, heroType: HeroKind): boolean {
        // Herokind already been taken
        let heroTaken = false;
        this.heroList.forEach((hero, key) => {
            if (hero.getKind() === heroType) {
                heroTaken = true;
            }
        })
        if (heroTaken) return false; // failed to bind hero

        let hero = this.availableHeros.filter((hero) => hero.hk === heroType) // find hero
        if (hero.length === 1) {
            this.heroList.set(id, hero[0]);
            if (!this.activeHeros.includes(heroType)) {
                this.activeHeros.push(heroType);
            }
            // update start of game currPlayersTurn
            console.log("binding hero rank", hero[0].getRank())
            if (!this.initialCollabDone && hero[0].getRank() < this.gameStartMinRank) {
                this.gameStartMinRank = hero[0].getRank();
                this.currPlayersTurn = heroType;
                console.log("currplayersturn updated to", heroType, hero[0].getRank());
            }
            return true;
        }
        return false;

    }

    public setCastle(c) {
        if (c != null)
            this.castle = new RietburgCastle(c.numDefenseShields, c.numDefenseShieldsUsed);
    }

    public getCastle() {
        return this.castle;
    }

    public getHeros() {
        return this.heroList;
    }

    public getActiveHeros() {
        return this.activeHeros;
    }

    public setActiveHeros(kinds) {
        this.activeHeros = kinds;
    }

    public removeFromActiveHeros(connID: string) {
        var hk = this.getHkFromConnID(connID);
        if (hk == "none") {
            console.log("ERROR: removeFromActiveHeros - connID not found in heroList");
            return;
        }

        const index = this.activeHeros.indexOf(hk, 0);
        if (index == -1) {
            console.log("ERROR:", hk, "not in activeHeros");
            return;
        }
        this.activeHeros.splice(index, 1);
    }

    public resetActiveHeros() {
        this.activeHeros = Array.from(this.heroList.values()).map(h => h.hk);
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

    /*public removePlayer(id: string) {
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
    }*/
    public removePlayer(id: string): boolean {
        this.players.forEach((player) => {
            if (player.getID() === id) {
                this.players.delete(player);
            }
        })
        if (this.heroList.has(id)) {
            this.heroList.delete(id);
            this.readyplayers--;
            return true;   
        }
        return false;
    }

    public setCurrPlayersTurn(hk: HeroKind) {
        this.currPlayersTurn = hk;
    }

    public getCurrPlayersTurn() {
        return this.currPlayersTurn;
    }

    // takes string s: the connection ID of the hero
    public setNextDayFirstHero(connID: string) {
        let hk = this.getHkFromConnID(connID);
        if (hk == HeroKind.None) {
            console.log("ERROR: setNextDayFirstHero received HeroKind.None");
        }
        this.nextDayFirstHero = hk;
    }

    public moveHeroTo(hero, tile) {
        hero.moveTo(tile)
    }

    public pushToLog(item) {
        this.chatlog.push(item)
    }

    public getChatLog() {
        return this.chatlog;
    }

    public getMonsters() {
        return this.monsters
    }

    public deleteMonster(monstername) {
        this.monsters.delete(monstername)
    }

    // Returns number of shields remaining
    public moveMonster(m){
        var startReg = m.getTileID();
        var nextRegID = this.regions[startReg].getNextRegionId();
        var shieldsRemaining
        //var currM
        // console.log(this.regions[nextRegID])
        // if(nextRegID != 0){
        //     var currM = this.regions[nextRegID].getMonster()
        // }
        var regionsCurrM = this.regions[nextRegID].getMonster()
        //else()
        //if monster enters castle, update shields, evaluate end of game
        if (nextRegID == 0) {
            // Monster is going to enter the castle
            // Decrement shields, remove monster, evaluate end of game condition
            this.monstersInCastle.push(m.name);
            shieldsRemaining = this.castle.attackOnCastle();
            this.regions[startReg].setMonster(null);
            // self.monsters.delete(m.name);
        }
         // Update the two tiles and the monster
         this.regions[nextRegID].setMonster(m);
         this.regions[startReg].setMonster(null);
         m.setTileID(nextRegID);
         if (this.castle.getShields() <= 0) {
             this.endOfGame = true;
         }
         else{
             this.killFarmersOnTile(nextRegID)
             this.killFarmersOfHeroes(nextRegID, null)
         }
         return {shieldsRemaining, regionsCurrM};
    }
    // Returns number of shields remaining
    public moveMonsters() : number {
        var self = this;
        // var shieldsLost: number[] = [];
        var shieldsRemaining: number = this.castle.getShields();

        // Move monsters in phases based on MonsterKind: Gors, Skrals, Wardraks
        // Also need to sort the monsters based on tileID
        var gors: Monster[] = [];
        var skrals: Monster[] = [];
        var wardraks: Monster[] = [];

        for (let m of Array.from(this.monsters.values())) {
            switch (m.getType()) {
                case MonsterKind.Gor:
                    gors.push(m);
                    break;
                case MonsterKind.Skral:
                    skrals.push(m);
                    break;
                case MonsterKind.Wardrak:
                    wardraks.push(m);
                    break;
                default: // Fortress does not move
                    break;
            }
        }

        // Inline custom sort of monsters on tileID
        gors.sort((a, b) => (a.getTileID() - b.getTileID()));
        skrals.sort((a, b) => (a.getTileID() - b.getTileID()));
        wardraks.sort((a, b) => (a.getTileID() - b.getTileID()));

        // Note that fortress does not move
        var sortedMonsters = gors.concat(skrals).concat(wardraks).concat(wardraks);
        // Move each monster based on tile and type ordering
        // Note that wardraks get to move twice
        for (let m of sortedMonsters) {
            // Edge case: ignore a monster that already entered the castle
            if (this.monstersInCastle.find(e => e == m.name)) continue;

            var startReg = m.getTileID();
            var nextRegID = startReg;
            // Algo to find the next available region for the monster to land on
            // Also need to handle the monster advancing all the way into the castle
            // if this happens then we can update shields and check for end of game
            do {
                nextRegID = self.regions[nextRegID].getNextRegionId();
                // base case: the region is tile 0 (the castle)
                if (nextRegID == 0) {
                    // Monster is going to enter the castle
                    // Decrement shields, remove monster, evaluate end of game condition
                    this.monstersInCastle.push(m.name);
                    shieldsRemaining = self.castle.attackOnCastle();
                    self.regions[startReg].setMonster(null);
                    // self.monsters.delete(m.name);
                    break;
                }
            } while (self.regions[nextRegID].getMonster());

            // Update the two tiles and the monster
            self.regions[nextRegID].setMonster(m);
            self.regions[startReg].setMonster(null);
            m.setTileID(nextRegID);

            if (self.castle.getShields() <= 0) {
                self.endOfGame = true;
            }
        }

        return shieldsRemaining;
    }

    public replenishWells() {
        var flag = true;
        var replenishedIDs: number[] = [];

        for (let region of this.regions) { // for every region
            if (region.getHasWell()) { // if region has a well
                flag = true;
                let idRegion = region.getID();

                // Replenish wells that have no hero on them
                for (let h of this.heroList.values()) {
                    let idRegionOfHero = h.getRegion().getID();
                    if (idRegionOfHero === idRegion) {
                        flag = false //found a hero on well tile
                        break;
                    }
                }
                //if no one standing on well tile, replenish well
                if (flag) {
                    region.setWellUsed(false)
                    replenishedIDs.push(idRegion);
                }
            }
        }

        return replenishedIDs;
    }

    public resetHeroHours(connID: string) {
        if (this.heroList.get(connID) == undefined) {
            console.log("ERROR: cannot find", connID, "in heroList");
            return;
        } else {
            // **Based on time of day starting at 1
            this.heroList.get(connID)?.setTimeOfDay(1);
            return this.heroList.get(connID)?.getKind();
        }
    }

    public setEndOfGameState(b: boolean) {
        this.endOfGame = b;
    }
    public getEndOfGameState() {
        return this.endOfGame;
    }

    public setMonstersInCastle(arr) {
        this.monstersInCastle = arr;
    }

    public getMonstersInCastle() {
        return this.monstersInCastle;
    }

    // Advances narrator, updates game state accordingly, and returns the new narrator position
    public advanceNarrator() : Monster[] {
        let newPos = this.narrator.advance();

        var newMonsters: Monster[] = []
        switch(newPos) {
            case this.narrator.getRunestoneLegendPos():
                // place the runestones on the board
                newMonsters = this.narratorRunestones();
                break;
            case 2: // Legend card C
                newMonsters = this.narratorC();
                break;
            case 6: // Legend card G
                newMonsters = this.narratorG();
                break;
        }

        return newMonsters;
    }

    public setRunestoneLegendPos() : number {
        this.runestoneCardPos = this.narrator.setRunestoneLegendPos();
        // console.log('server set runestone card on', this.runestoneCardPos)
        return this.runestoneCardPos;
    }

    // sets positions of the runestones and adds them to the regions
    private narratorRunestones() : Monster[] {
        this.narrator.setRunestoneLocations();
        let runestoneLocs = this.narrator.getRunestoneLocations();
        // Update tiles with runestones
        runestoneLocs.forEach(stoneObj => {
            Object.entries(stoneObj).forEach(([tileID, stone]) => {
                this.regions[tileID].addItem(stone);
            })
        })

        // Place gor on space 43 and skral on space 39
        // TODO: for naming, we need to use a separate count instead of basing it on the size of
        // the monsters list. The list can decrease in size meaning monsters can end up with the same name
        // For now, names are hardcoded
        var monsterList: Monster[] = [];
        let monster: Monster | null = this.addMonster(MonsterKind.Gor, 43, 'gor8')
        if (monster != null) {
            monsterList.push(monster);
        }
        monster = this.addMonster(MonsterKind.Skral, 39, 'skral2');
        if (monster != null) {
            monsterList.push(monster);
        }

        return monsterList;
    }

    private narratorC() : Monster[] {
        var monsterList: Monster[] = [];
        // Place Skral Stronghold and Skral, farmer, gors, skral, prince
        // Determine position of stronghold
        let dieRoll = this.narrator.randomInteger(1, 6);

        let monster: Monster | null = this.addMonster(MonsterKind.Fortress, 50+dieRoll, 'fortress');
        if (monster != null) {
            monsterList.push(monster);
        }

        // Add farmer
        let farmObj = new Farmer(2, 28);
        this.farmers.push(farmObj)
        this.regions[farmObj.getTileID()].addFarmer(farmObj);

        // Add more monsters
        monster = this.addMonster(MonsterKind.Gor, 27, 'gor9');
        if (monster != null) {
            monsterList.push(monster);
        }
        monster = this.addMonster(MonsterKind.Gor, 31, 'gor10');
        if (monster != null) {
            monsterList.push(monster);
        }
        monster = this.addMonster(MonsterKind.Skral, 29, 'skral3');
        if (monster != null) {
            monsterList.push(monster);
        }

        // Add my boy Thorald
        this.prince = new Prince(this.regions[72]);

        // Display StoryWindows
        return monsterList;
    }

    private narratorG() : Monster[] {
        // Remove prince, add wardraks
        // Cya Thorald
        this.prince = null;

        var monsterList: Monster[] = [];
        // Add spookyboys
        let monster: Monster | null = this.addMonster(MonsterKind.Wardrak, 26, 'wardrak1');
        if (monster != null) {
            monsterList.push(monster);
        }
        monster = this.addMonster(MonsterKind.Wardrak, 27, 'wardrak2');
        if (monster != null) {
            monsterList.push(monster);
        }

        // Display StoryWindows
        return monsterList;
    }


    public narratorN(): boolean {
        /*check fortSkral is defeated*/
        var fortSkralDefeated: boolean = true;
        //console.log("%%% model game narratorN fortressSkral", this.monsters)
        if (this.monsters.has("fortress")) { fortSkralDefeated = false;}
        //console.log("fortSkral defeated: ", fortSkralDefeated)

        /*check region 0 has herb*/
        var herbAtCastle: boolean = false;       
        for (let [key, value] of Object.entries(this.regions[0].getItems())) {
            if (key === SmallItem.Herb) { herbAtCastle = true; }
        }
        //console.log("%%% model game narratorN herb", Object.entries(this.regions[0].getItems()) )

        /*check castle has at least 1 shield*/
        var hasEnoughShields: boolean = true;
        if (this.castle.getShields() <= 0) { hasEnoughShields = false; }
        //console.log("%%% model game narratorN enoughShields", this.castle.getShields(), "hasEnoughShields: ", hasEnoughShields)

        var winOrLose = (fortSkralDefeated && herbAtCastle && hasEnoughShields)
        //console.log("%%% model game narratorN winOrLose", winOrLose) 

        // this.endOfGame = true;

        return winOrLose
        
    }

    // Turns a hidden runestone into its real counterpart if a hero performs a valid reveal
    public revealRunestone(h: Hero, tileID: number, stoneName: string) : {success: boolean, usedTelescope: boolean} {
        var heroTileID = h.getRegion().getID();
        var region = this.regions[tileID];
        // Success if hero is one the same region as the stone
        if (heroTileID == tileID) {
            region.removeItem(stoneName);
            region.addItem(stoneName.slice(0, -2));
            return { success: true, usedTelescope: false };
        }
        // Success if hero is on an adjacent tile and has a telescope
        var adjTiles = region.getAdjRegionsIds();
        var heroItems = h.getSmallItems()
        if (adjTiles.includes(heroTileID) && heroItems.includes(SmallItem.Telescope)) {
            region.removeItem(stoneName);
            region.addItem(stoneName.slice(0, -2));
            return { success: true, usedTelescope: true };
        }
        // Otherwise failure
        return { success: false, usedTelescope: false };
    }

    public useFog(fog: Fog, tile: number) {
        if (this.fogs.get(tile) != undefined && this.fogs.get(tile) == fog) { // make sure tile has a fog and its the same
            this.fogs.delete(tile); // delete fog from game
            // testing useFog
            var currHero = this.getHeroFromHk(this.currPlayersTurn);
            console.log("fog test, currHero:", currHero);

            if (fog == Fog.Gor) {
                // TODO: change this naming strategy
                const id = `gor${this.monsters.size + 1}`;
                let newMonster = this.addMonster(MonsterKind.Gor, tile, id)
                let status = (newMonster != null);
                return { success: true, createSuccess: status, id: id, newTile: newMonster?.getTileID() };
            } else if (fog == Fog.Gold) {
                this.getHeroFromHk(this.currPlayersTurn)!.updateGold(1);
                return { success: true };
            } else if (fog == Fog.WillPower2) {
                this.getHeroFromHk(this.currPlayersTurn)!.setWill(2);
                return { success: true };
            } else if (fog == Fog.WillPower3) {
                this.getHeroFromHk(this.currPlayersTurn)!.setWill(3);
                return { success: true };
            } else if (fog == Fog.Strength) {
                this.getHeroFromHk(this.currPlayersTurn)!.setStrength(2);
                return { success: true };
            } else if (fog == Fog.WitchFog) {
                let toPlayer = false;
                if (this.getHeroFromHk(this.currPlayersTurn)?.pickUpSmallItem(tile, SmallItem.Brew)) {
                    toPlayer = true;
                } else {
                    this.regions[tile].addItem(SmallItem.Brew);
                    toPlayer = false;
                }
                // Create new Witch
                console.log("creating witch on tile with price", tile, this.numOfDesiredPlayers + 1);
                this.witch = new Witch(tile, this.numOfDesiredPlayers + 1);
                let herbTileID = this.witch.placeHerb();
                return { success: true, createSuccess: toPlayer, newTile: herbTileID };
            } else if (fog == Fog.Wineskin) {
                if (this.getHeroFromHk(this.currPlayersTurn)?.pickUpSmallItem(tile, SmallItem.Wineskin)) {
                    return { success: true, createSuccess: true };
                }
            } else if (fog == Fog.EventCard) {
                var newEvent = this.drawCard()
                if (newEvent != null) {
                    return { success: true, event: newEvent }
                }
                return { success: false, event: null }
            }
        }
        return { success: false };
    }

    // Returns the Hero instance in heroList corresponding to the HeroKind requested
    private getHeroFromHk(hk: HeroKind): Hero | null {
        var hero;
        Array.from(this.heroList.values()).forEach(h => {
            if (h.hk == hk) {
                hero = h;
            }
        });
        if (hero == null) {
            console.log("ERROR: getHeroFromHk found no match for", hk);
        }
        return hero; // null if no corresponding hero is found
    }

    public getConnIdFromHk(hk: HeroKind): string | null {
        var connID;
        this.heroList.forEach(function (h, id) {
            if (h.hk == hk) {
                connID = id;
            }
        });
        if (connID == null) {
            console.log("ERROR: getConnIdFromHk found no match for", hk);
        }
        return connID; // null if no corresponding hero is found
    }
    public getHkFromConnID(connID: string): HeroKind {
        var hk = this.heroList.get(connID)?.hk;
        if (hk == null) {
            hk = HeroKind.None; // set to None if no match found
            console.log("ERROR: getHkFromConnID found no hk match for", connID);
        }
        return hk;
    }
    public dangerousRegion(reg:Region){
        return (reg.getID() == 22 || reg.getID() == 23 || reg.getID() == 24 || reg.getID() == 25) 
                && this.activeEvents.includes(21)
    }
    public strengthRegion(reg:Region){
        return (reg.getID() == 57) && this.activeEvents.includes(3)
    }
    public regionBordersRiver(reg:Region){
        var riverBorderRegionIds = [11,12,13,16,32,38,28,29,30,33,31,27,26,37,41,40,39,42,44,46,64,63,56,47,48,49]
        var id = reg.getID()
        return riverBorderRegionIds.includes(id)
    }
    public drawCard(){
        return this.eventDeck.shift()
    }
    public setActiveEvents(events) {
        events.forEach((id) => {
            this.activeEvents.push(id);
        })
    }

    public setEventDeck(events) {
        events.forEach(ec => {
            this.eventDeck.push(new EventCard(ec.id, ec.flavorText, ec.desc))
        })
    }

    private shuffleEventDeck(){
        let m = this.eventDeck.length, i
        while(m){
            i = Math.floor(Math.random() * m)
            m--
            [this.eventDeck[m], this.eventDeck[i]] = [this.eventDeck[i], this.eventDeck[m]]
        }
    }
    public clearActiveEvents() {
        var eventsLeft = Array<Number>()
        //revert events which affected state
        for (var i = 0; i < this.activeEvents.length; i++) {
            //revert changes to monster strength
            if (this.activeEvents[i] == 11) {
                for (let [name, monster] of this.monsters) {
                    let currStr = monster.getStrength()
                    monster.setStrength(currStr - 1)
                }
            }
            if(this.activeEvents[i] == 21){
                eventsLeft.push(this.activeEvents[i])
            }
        }
        //clear activeEvents
        this.activeEvents = eventsLeft
    }

    public applyEvent(event) {
        console.log("Applying event: ", event.id)
        //do something
        if(event.id == 1){
            //do nothing
        }
        else if(event.id == 2){
            for(let [conn,hero] of this.heroList){
                let tID = hero.getRegion().getID()
                if (0 <= tID && tID <= 20) {
                    hero.setWill(-3)
                }
            }
        }
        else if(event.id == 3){
            var count = 0
            //var highestHero = new Hero()
            var highestRank = Number.MIN_VALUE
            var highestHeroKind = HeroKind.None
            for(let [conn,hero] of this.heroList){
                if(hero.getRegion().getID() == 57){
                    count++
                    if(highestRank < hero.getRank()){
                        //highestHero = hero
                        highestRank = hero.getRank()
                        highestHeroKind = hero.getKind()
                    }
                }
            }
            if(count >= 1){
                //give highestHero strength point
                for(let [conn,hero] of this.heroList){
                    if(hero.getKind() == highestHeroKind){
                        hero.setStrength(1)
                    }
                }
            }
            else{
                //add to active events until someone activates it
                this.activeEvents.push(event.id)
        
            }
        }
        else if(event.id == 5){
            for(let [conn,hero] of this.heroList){
                let tID = hero.getRegion().getID()
                if (37 <= tID && tID <= 70) {
                    hero.setWill(-3)
                }
            }
        }
        else if(event.id == 7){
            //handled on server controller
        }
        else if(event.id == 9){
            this.activeEvents.push(9)
        }
        else if(event.id ==11){
            for(let [name,monster] of this.monsters){
                let currStr = monster.getStrength()
                monster.setStrength(currStr + 1)
            }
            this.activeEvents.push(11)
        }
        else if (event.id == 12) {
            for (let [conn, hero] of this.heroList) {
                if (hero.getKind() == HeroKind.Archer || hero.getKind() == HeroKind.Mage) {
                    hero.setWill(3)
                }
            }
        }
        else if (event.id == 13) {
            for (let [conn, hero] of this.heroList) {
                let currWill = hero.getWill()
                if (currWill < 10) {
                    hero.setWill(10 - currWill)
                }
            }
        }
        else if (event.id == 14) {
            for (let [conn, hero] of this.heroList) {
                if (hero.getKind() == HeroKind.Dwarf || hero.getKind() == HeroKind.Warrior) {
                    hero.setWill(3)
                }
            }
        }
        else if (event.id == 15) {
            this.regions[35].removeWell()
        }
        else if (event.id == 17) {
            for (let [conn, hero] of this.heroList) {
                let currWill = hero.getWill()
                if (currWill > 12) {
                    hero.setWill(12 - currWill)
                }
            }
        }
        else if (event.id == 19) {
            this.activeEvents.push(event.id)
        }
        else if(event.id == 20){
            //do nothing
        }
        else if(event.id == 21){
            var count = 0
            //var highestHero = new Hero(HeroKind.None, this.regions[0])
            var highestRank = Number.MIN_VALUE
            var highestHeroKind = HeroKind.None
            for(let [conn,hero] of this.heroList){
                let reg = hero.getRegion().getID()
                if(reg == 22 || reg == 23 || reg == 24 || reg == 25){
                    count++
                    if(highestRank < hero.getRank()){
                        //highestHero = hero
                        highestRank = hero.getRank()
                    }
                }
            }
            if(count >= 2){
                //give highestHero strength point
                for(let [conn,hero] of this.heroList){
                    if(hero.getKind() == highestHeroKind){
                        hero.setStrength(1)
                    }
                }
            }
            else{
                this.activeEvents.push(21)
            }
        }
        else if(event.id == 22){
            this.regions[45].removeWell()
        }
        else if (event.id == 24) {
            for (let [conn, hero] of this.heroList) {
                let tID = hero.getRegion().getID()
                if (tID == 71 || tID == 72 || tID == 0 || 47 <= tID && tID <= 63) {
                    //this hero is safe
                    continue
                }
                else {
                    hero.setWill(-2)
                }
            }
        }
        else if (event.id == 26) {
            this.activeEvents.push(event.id)
        }
        else if (event.id == 28) {
            for (let [conn, hero] of this.heroList) {
                let time = hero.getTimeOfDay()
                console.log(hero.getKind(), time)
                if (time == 1) {
                    hero.setWill(2)
                }
            }
        }
        else if(event.id == 29){
            //handled on server controller
        }
        else if(event.id == 30){
            //handled on server controller
        }
        else if(event.id == 31){
            for(let [conn,hero] of this.heroList){
                let tID = hero.getRegion().getID()
                if (tID == 71 || tID == 72 || tID == 0 || 47 <= tID && tID <= 63) {
                    //this hero is safe
                    continue
                }
                else {
                    hero.setWill(-2)
                }
            }
        }
        else if (event.id == 32) {
            for (let [conn, hero] of this.heroList) {
                let time = hero.getTimeOfDay()
                console.log(hero.getKind(), time)
                if (time == 1) {
                    hero.setWill(-2)
                }
            }
        }
        else if(event.id == 33){
            //handled on server controller
        } 
        //if one that returns to deck ?? not sure if any return
    }

    public setBlockedEvent(b){
        this.blockedEvent = b
    }
    public getBlockedEvent(){
        return this.blockedEvent
    }
    
    public getEventDeck() {
        return this.eventDeck;
    }

    public getActiveEvents() {
        return this.activeEvents;
    }

    private shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}