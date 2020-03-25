export class RietburgCastle {
    private numDefenseShields: number
    private numDefenseShieldsUsed: number

    constructor() {
        this.numDefenseShields = 0;
        this.numDefenseShieldsUsed = 0;
    }

    public setShields(s: number){
        this.numDefenseShields = s;
    }

    public getShields(){
        return this.numDefenseShields;
    }

    public attackOnCastle(){
        this.numDefenseShields--;
        this.numDefenseShieldsUsed++;
        console.log("Castle attacked! shields remaining:", this.numDefenseShields);
    }

    public incShields(){
        this.numDefenseShields++;
    }
}