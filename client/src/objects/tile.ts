import * as Phaser from 'phaser';
import { Hero } from './hero';

export class Tile extends Phaser.GameObjects.Sprite {
    public adjacent: Tile[] = [];
    public id: number;
    public heroexist: boolean = false;
    public x: number;
    public y: number;
    private graphic;
    public hero: Hero;
    constructor(id, scene, x, y, texture) {
        super(scene, x, y, 'tiles', texture);
        this.id = id;
        this.x = x;
        this.y = y;
        this.hero = null;
        this.on('pointerdown', function (pointer) { this.printstuff() });
        this.on('pointerdown', function (pointer) { this.moveRequest() })
    }
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
        this.adjacent.forEach(element => {
            try {
                console.log(element.id)
            }
            catch (e) { }
        });
        console.log(this.id + ' tile has hero? ' + this.heroexist)
    }

    public moveRequest() {
        console.log("New request.");
        this.adjacent.forEach(element => {
            try {
                console.log(element.id);
                if (element.heroexist == true) {
                    this.hero = element.hero.move(this);
                    if (this.hero.tile === this) {
                        this.heroexist = true;
                        element.hero = null;
                        element.heroexist = false;
                    }

                }
            }
            catch (e) { console.log("Tile: " + element.id + " threw an error.") }
        });

    }
}