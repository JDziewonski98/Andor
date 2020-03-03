import * as Phaser from 'phaser';
import { Hero } from './hero';
import {htX, htShift} from '../constants'

export class HourTracker extends Phaser.GameObjects.Sprite {
    // private constants = require('../constants');
    
    // should keep track of all heroes, not just one
    private counts: number[] = [];
    // private hero: Hero; // don't think we need this ref
    // private id: number; // don't think hourTracker needs an id
    private heroSprites: Phaser.GameObjects.Sprite[];
    public heroCoords: number[][];

    constructor(scene, x, y, heroSprites) {
        // Note that the texture for hourTracker is not actually used
        // Instead we pass up to 4 sprites to use internally, 1 for each hero
        super(scene, x, y, heroSprites[0]);
        // this.id = hero.id;
        // Init all hour counts to 0
        for (var i=0; i<heroSprites.length; i++) {
            this.counts.push(0);
        }
        // this.hero = hero;
        this.heroSprites = heroSprites
        // Set coordinates for hero representations as 2d array
        this.heroCoords = [
            [x-20, y-20],
            [x+20, y-20],
            [x-20, y+20],
            [x+20, y+20]
        ]

        // deprecated code
        // this.on('pointerdown', function (pointer) {
        //     this.reset();
        // });

    }
    public reset(heroID) {
        this.counts[heroID] = 0;
        this.x = htX;
        this.heroSprites[heroID].x = htX;

        // resetHours calls this function, should not be here
        // this.hero.resetHours();
    }
    public incHour(heroID) {
        this.counts[heroID]++;
        this.heroSprites[heroID].x += htShift;
        this.x += htShift;
    }
    public getCount(heroID) {
        return this.counts[heroID];
    }
}