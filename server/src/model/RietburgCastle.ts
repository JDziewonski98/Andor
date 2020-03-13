export class RietburgCastle {
    private numDefenseSheilds: number
    private numDefenseSheildsUsed: number

    constructor() {
        this.numDefenseSheilds = 0;
        this.numDefenseSheildsUsed = 0;
    }

    public setSheilds(s: number){
        this.numDefenseSheilds = s;
    }

    public getSheilds(){
        return this.numDefenseSheilds;
    }

    public attackOnCastle(){
        this.numDefenseSheilds--;
        this.numDefenseSheildsUsed++;
    }

    public incSheilds(){
        this.numDefenseSheilds++;
    }
}