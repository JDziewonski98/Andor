import * as Phaser from 'phaser';

export class Tile extends Phaser.GameObjects.Rectangle{
    public adjacent: Tile[] = [];
    public id: number;
    constructor(id, scene, x, y, w, h, fc) {
        super(scene, x, y, w, h,fc);
        this.id = id;
    }
    public printstuff() {
        console.log("Tile's id: " + this.id);
        this.adjacent.forEach(element => {
            try{
                console.log(element.id)
            }
            catch(e){}
        });
    }
}