import * as Phaser from 'phaser';
import { Hero } from './hero';
import {htX, htShift} from '../constants'
import {HeroKind} from './HeroKind'

export class HourTracker extends Phaser.GameObjects.Sprite {
    // private constants = require('../constants');
    
    // should keep track of all heroes, not just one
    private heroSprites: Map<HeroKind,Phaser.GameObjects.Sprite>;
    
    // private hero: Hero; // don't think we need this ref
    // private id: number; // don't think hourTracker needs an id
    

    constructor(scene, x, y, heroSprites) {
        // Note that the texture for hourTracker is not actually used
        // Instead we pass up to 4 sprites to use internally, 1 for each hero
        super(scene, x, y, heroSprites[0]);
        this.heroSprites = heroSprites


    }
    public reset(heroID) {
        //this.counts[heroID] = 0;
        this.x = htX;
        this.heroSprites[heroID].x = htX;

        // resetHours calls this function, should not be here
        // this.hero.resetHours();
    }
    public incHour(hk: HeroKind ) {
        //this.counts[hk]++;
        this.heroSprites[hk].x += htShift
        //this.x += htShift;
    }
    public getCount(heroID) {
        //return this.counts[heroID];
    }
}