export class Game{
    private numOfDesiredPlayers: Number;
    private difficulty: GameDifficulty;
    private castle: RietburgCastle;

    constructor(numOfDesiredPlayers, difficulty, castle){
        this.numOfDesiredPlayers = numOfDesiredPlayers;
        this.difficulty = difficulty;
        this.castle = castle;
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

}