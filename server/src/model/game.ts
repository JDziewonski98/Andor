import { 
    GameDifficulty, 
    RietburgCastle, 
    Farmer, 
    Region, 
    Player, 
    Hero, 
    HeroKind, 
    Monster,
    MonsterKind
} from "."

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
    private monsters:Map<string, Monster>;
    private monstersInCastle: string[];
    private currPlayersTurn: string;
    // collab decision related state
    public numAccepts: number;

    private availableHeros: Array<HeroKind> = new Array(HeroKind.Archer, HeroKind.Dwarf, HeroKind.Mage, HeroKind.Warrior);

    constructor(name: string, numOfDesiredPlayers: number, difficulty: GameDifficulty) {
        this.name = name;
        this.numOfDesiredPlayers = numOfDesiredPlayers;
        this.difficulty = difficulty;
        this.castle = new RietburgCastle()
        this.chatlog = [];
        this.players = new Set<Player>();
        this.heroList = new Map<string, Hero>();
        this.regions = new Array<Region>();
        this.farmers = new Array<Farmer>();
        this.monsters = new Map<string, Monster>();
        this.monstersInCastle = [];
        this.currPlayersTurn = ""
        this.setRegions();
        this.setFarmers();
        this.setMonsters();
        this.setSheilds();
        console.log(this.castle.getSheilds(), "sheilds");
        this.readyplayers = 0;

        this.numAccepts = 0;
    }
    private setFirstHerosTurn(){
        var minRank = Number.MAX_VALUE;
        var ID = "none";
        for(var socketID in this.heroList){
            var hero = this.heroList[socketID]
            if(hero.getRank() < minRank){
                minRank = hero.getRank()
                ID = socketID
            }
        }
        console.log(ID)
        return this.heroList[ID].getKind()
    }

    public nextPlayer(){
        console.log("nextPlayer")
        console.log("currentPlayersTurn: ", this.currPlayersTurn)
        var minRank = this.getHero(this.currPlayersTurn).getRank();
        var maxRank = Number.MAX_VALUE;
        var socketID = "none";
        this.heroList.forEach((hero,ID) => {
            if(hero.getRank() > minRank && hero.getRank() < maxRank ){
                maxRank = hero.getRank()
                socketID = ID
            }
        })
        if(socketID == "none"){
            minRank = Number.MAX_VALUE
            this.heroList.forEach((hero,ID) => {
                if(hero.getRank() < minRank){
                    minRank = hero.getRank()
                    socketID = ID
                }
            })
        }
        return socketID;
    }

    private setSheilds(){
        var numPlayers = this.numOfDesiredPlayers;
    
        if(numPlayers === 2){
            console.log(numPlayers, "inside")
            this.castle.setSheilds(3);
        }else if(numPlayers === 3){
            this.castle.setSheilds(2);
        }else if(numPlayers === 4){
            this.castle.setSheilds(1);
        }
    }

    private setFarmers() {
        //this.regions[24].initFarmer()
        this.farmers.push(new Farmer(0, this.regions[24]));
        this.farmers.push(new Farmer(1, this.regions[36]));
        this.regions[24].addFarmer(this.farmers[0]);
        this.regions[36].addFarmer(this.farmers[1]);
        console.log(this.regions[36])
    }

    private setMonsters() {
        let gor1 = new Monster(MonsterKind.Gor, 8, this.numOfDesiredPlayers,'gor1')
        let gor2 = new Monster(MonsterKind.Gor, 20, this.numOfDesiredPlayers, 'gor2')
        let gor3 = new Monster(MonsterKind.Gor, 21, this.numOfDesiredPlayers, 'gor3')
        let gor4 = new Monster(MonsterKind.Gor, 26, this.numOfDesiredPlayers, 'gor4')
        let gor5 = new Monster(MonsterKind.Gor, 48, this.numOfDesiredPlayers,'gor5')
        let skral = new Monster(MonsterKind.Skral, 19, this.numOfDesiredPlayers, 'skral1')
        // let war = new Monster(MonsterKind.Wardrak, 1, this.numOfDesiredPlayers, 'wardrak1')

        this.monsters.set(gor1.name, gor1)
        this.monsters.set(gor2.name, gor2)
        this.monsters.set(gor3.name, gor3)
        this.monsters.set(gor4.name, gor4)
        this.monsters.set(gor5.name, gor5)
        this.monsters.set(skral.name, skral)
        // this.monsters.set(war.name, war)

        this.regions[8].setMonster(gor1)
        this.regions[20].setMonster(gor2)
        this.regions[21].setMonster(gor3)
        this.regions[26].setMonster(gor4)
        this.regions[48].setMonster(gor5)
        this.regions[19].setMonster(skral)
        // this.regions[1].setMonster(war)
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

    public getCastle(){
        return this.castle;
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
    public setCurrPlayersTurn(s:string){
        this.currPlayersTurn = s;
        console.log("Set currPlayersTurn to: ", s)
    }
    public getCurrPlayersTurn(){
        return this.currPlayersTurn;
    }
    public moveHeroTo(hero, tile) {
        console.log("Passed method call")
        hero.moveTo(tile)
    }
    private endGame() {
        //TO BE IMPLEMENTED
        this.replenishWell()
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

    public getMonsters() {
        return this.monsters
    }

    public deleteMonster(monstername) {
        this.monsters.delete(monstername)
    }

    public endOfDay() {
        this.moveMonsters();
    }

    public moveMonsters() {
        var self = this;
        // Move monsters in phases based on MonsterKind: Gors, Skrals, Wardraks
        // Also need to sort the monsters based on tileID
        var gors: Monster[] = [];
        var skrals: Monster[] = [];
        var wardraks: Monster[] = [];

        for(let m of Array.from(this.monsters.values())) {
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
        gors.sort((a,b) => (a.getTileID() - b.getTileID()));
        skrals.sort((a,b) => (a.getTileID() - b.getTileID()));
        wardraks.sort((a,b) => (a.getTileID() - b.getTileID()));

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
                // base case: the region is tile 0
                if (nextRegID == 0) {
                    // Monster is going to enter the castle
                    // Decrement shields, remove monster, evaluate end of game condition
                    this.monstersInCastle.push(m.name);
                    self.castle.attackOnCastle();
                    self.regions[startReg].setMonster(null);
                    // self.monsters.delete(m.name);
                    if(self.castle.getSheilds() == 0){
                        //ENDGAME
                    }
                    break;
                }
                // TODO endday: will crash on this condition if a wardrak tries to enter the castle twice
            } while (self.regions[nextRegID].getMonster());

            // Update the two tiles and the monster
            self.regions[nextRegID].setMonster(m);
            self.regions[startReg].setMonster(null);
            m.setTileID(nextRegID);
            console.log("moved", m.name, "btw tiles", startReg, nextRegID);
        }
    }
}