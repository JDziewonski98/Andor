import * as Phaser from 'phaser';
import { Hero } from './hero';

export class HourTracker extends Phaser.GameObjects.Sprite {
    public count: number;
    public hero: Hero;
    public id: number;
    public sprite: Phaser.GameObjects.Sprite;

    constructor(scene, x, y, sprite, hero) {
        super(scene, x, y, sprite);
        //super(scene, image, hero);
        this.id = hero.id;
        this.count = 0;
        this.hero = hero;
        this.sprite = sprite;
        this.on('pointerdown', function (pointer) {
            this.reset();
        });

    }
    public reset() {
        this.x = 625;
        this.sprite.x = 625;
        this.hero.resetHours();
    }
}