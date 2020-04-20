import { Region} from '.';

export class Prince{
    private tile: Region;

    constructor(tile: Region) {
        this.tile = tile;
    }

    public moveTo(newRegion: Region){
        this.tile = newRegion;
    }

    public getRegion(){
        return this.tile;
    }

    public setRegion(r: Region){
        this.tile = r;
    }

}