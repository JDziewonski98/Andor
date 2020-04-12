import * as Phaser from 'phaser';
import { Farmer } from './farmer';
import { Monster } from './monster';

export class Tile extends Phaser.GameObjects.Sprite {
    public id: number;
    public x: number;
    public y: number;
    public farmers: Array<Farmer>;
    private monster: Monster;
    private fog: Phaser.GameObjects.Sprite;

    constructor(id, scene, x: number, y: number, texture: string, adj: Array<number>) {
        super(scene, x, y, 'tiles', texture);
        this.id = id;
        this.x = x;
        this.y = y;
        this.farmers = new Array(2);
        this.fog = null;
        this.monster = null;
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

    public getID() {
        return this.id;
    }
}