import * as Phaser from 'phaser';
import { Hero } from './hero';
// import { boardScalingFactor } from '../scenes/game'

// export var initialX = 4500;
// export var initialY = 200;

export class HourTracker extends Phaser.GameObjects.Sprite {
    private constants = require('../constants');
    
    private count: number;
    private hero: Hero;
    private id: number;
    private sprite: Phaser.GameObjects.Sprite;

    constructor(scene, x, y, sprite, hero) {
        super(scene, x, y, sprite);
        this.id = hero.id;
        this.count = 0;
        this.hero = hero;
        this.sprite = sprite;
        this.on('pointerdown', function (pointer) {
            this.reset();
        });

    }
    public reset() {
        this.count = 0;
        this.x = this.constants.htX;
        this.sprite.x = this.constants.htX;
        this.hero.resetHours();
    }
    public incHour() {
        this.count++;
        this.sprite.x += this.constants.htShift;
        this.x += this.constants.htShift;
    }
    public getCount() {
        return this.count;
    }
    // public getInitialLocation() {
    //     return (this.initialX, this.initialY);
    // }
}