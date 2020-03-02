import * as Phaser from 'phaser';
import { Hero } from './hero';

/* 
On the client, Tiles should definitely know what they have on them so that
those things can be displayed: Heroes, Monsters, Items, Farmers.
Not sure if Tiles need to know adjacencies on the client side. 
Tiles don't need to be sprites? Because they themselves aren't represented
by a
*/
export class Tile extends Phaser.GameObjects.Sprite {
    public adjacent: Tile[] = [];
    public id: number;
    public heroexist: boolean = false;
    public x: number;
    public y: number;
    private graphic;
    // Should support multiple heroes
    public hero: Hero;
    public heroCoords;

    constructor(id, scene, x, y, texture) {
        super(scene, x, y, 'tiles', texture);
        this.id = id;
        this.x = x;
        this.y = y;
        this.hero = null;
        this.on('pointerdown', function (pointer) { this.printstuff() });
        this.on('pointerdown', function (pointer) { this.moveRequest() })

        // Set coordinates for hero representations as 2d array
        this.heroCoords = [
            [this.x-30, this.y-30],
            [this.x+30, this.y-30],
            [this.x-30, this.y+30],
            [this.x+30, this.y+30]
        ]
    }

    // Unused
    public printHerodata() {
        if (this.heroexist) {
            console.log("Tile id: " + this.id + " has a hero with id: " + this.hero.id + ".");
        }
        else {
            console.log("Tile id: " + this.id + " does not have a hero.");
        }
    }

    public printstuff() {
        console.log("Tile's id: " + this.id);
        console.log("Adjacent tiles:");
        this.adjacent.forEach(element => {
            try {
                console.log(element.id)
            }
            catch (e) { }
        });
        console.log(this.id + ' tile has hero? ' + this.heroexist)
    }

    public moveRequest() {
        console.log("New request for hero to move to tile", this.id);
        this.adjacent.forEach(element => {
            try {
                // This algorithm is deprecated and should exist in server side business logic anyways
                if (element.heroexist == true) {
                    console.log("Hero", element.hero.id, "exists on tile", element.id);
                    this.hero = element.hero.move(this);
                    if (this.hero.tile === this) {
                        this.heroexist = true;
                        element.hero = null;
                        element.heroexist = false;
                    }

                }
            }
            catch (e) { console.log(e) }
        });

    }
}