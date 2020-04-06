export class RietburgCastle {
    private numDefenseShields: number
    private numDefenseShieldsUsed: number

    constructor(numShields = 0, numShieldsUsed = 0) {
        this.numDefenseShields = numShields;
        this.numDefenseShieldsUsed = numShieldsUsed;
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
        return this.numDefenseShields;
    }

    public incShields(){
        this.numDefenseShields++;
    }
}