export class RietburgCastle {
    private numDefenseShields: number
    private numDefenseShieldsUsed: number

    constructor(shields, used) {
        this.numDefenseShields = shields;
        this.numDefenseShieldsUsed = used;
    }

    public setShields(s: number){
        this.numDefenseShields = s;
    }

    public getShields(){
        return this.numDefenseShields;
    }

    public setUsedShields(s: number){
        this.numDefenseShieldsUsed = s;
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