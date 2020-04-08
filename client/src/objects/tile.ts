import * as Phaser from 'phaser';
import { Hero } from './hero';
import { Farmer } from './farmer';
import { Monster } from './monster';

/* 
On the client, Tiles should definitely know what they have on them so that
those things can be displayed: Heroes, Monsters, Items, Farmers.
Not sure if Tiles need to know adjacencies on the client side. 
Tiles don't need to be sprites? Because they themselves aren't represented
by a
*/
export class Tile extends Phaser.GameObjects.Sprite {
    public adjRegionsIds: number[] = [];
    public id: number;
    public heroexist: boolean = false;
    public farmerexist: boolean = false;
    public x: number;
    public y: number;
    // Should support multiple heroes
    public hero: Hero;
    public farmer: Array<Farmer>;
    public heroCoords;
    public farmerCoords;

    public gold: number;

    public monster: Monster;

    private fog: Phaser.GameObjects.Sprite;

    constructor(id, scene, x: number, y: number, texture: string, adj: Array<number>) {
        super(scene, x, y, 'tiles', texture);
        this.id = id;
        this.x = x;
        this.y = y;
        this.hero = null;
        this.farmer = new Array(2);
        this.gold = 0;
        this.fog = null;
        this.monster = null;
        this.adjRegionsIds = adj;

        //depricated
        // Set coordinates for hero representations as 2d array
        this.heroCoords = [
            [this.x - 30, this.y - 30],
            [this.x + 30, this.y - 30],
            [this.x - 30, this.y + 30],
            [this.x + 30, this.y + 30]
        ]

        this.farmerCoords = [
            [this.x, this.y + 30],
            [this.x, this.y - 30]
        ]

    }

    // Unused
    public printHerodata() {
        if (this.heroexist) {
            // console.log("Tile id: " + this.id + " has a hero with id: " + this.hero.id + ".");
        }
        else {
            console.log("Tile id: " + this.id + " does not have a hero.");
        }
    }

    public setFog(fog: Phaser.GameObjects.Sprite) {
        this.fog = fog;
    }

    public getFog(): Phaser.GameObjects.Sprite {
        return this.fog;
    }

    public setMonster(m: Monster) {
        this.monster = m;
    }

    // public setGold(amount: number) {
    //     this.gold = amount;
    // }

    // public getGold() {
    //     return this.gold;
    // }

    public getID() {
        return this.id;
    }
}