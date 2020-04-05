
import { Region, Hero } from '.';
//import { HourTracker } from './hourTracker';
// import { boardScalingFactor } from '../scenes/game'

// Why are Heroes Sprites and also take a Sprite as a constructor
// param? Why not just use the Sprite texture - then we don't have
// to update two things all the time
export class Farmer{
    private id:number
    private tileID: number;
    public carriedBy!: Hero | undefined;

    constructor(id, tileID) {
        this.id = id;
        this.tileID = tileID;
    }

    public getTileID(){
        return this.tileID;
    }

    public setTileID(tid: number){
        this.tileID = tid;
    }

    public getFarmerID(){
        return this.id;
    }

}