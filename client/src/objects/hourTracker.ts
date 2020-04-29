import * as Phaser from 'phaser';
import { Hero } from './hero';
import {htX, htShift} from '../constants'
import {HeroKind} from './HeroKind'

export class HourTracker extends Phaser.GameObjects.Sprite {
    private heroSprites: Map<HeroKind,Phaser.GameObjects.Sprite>;

    constructor(scene, x, y, heroSprites) {
        // Note that the texture for hourTracker is not actually used
        // Instead we pass up to 4 sprites to use internally, 1 for each hero
        super(scene, x, y, heroSprites[0]);
        this.heroSprites = heroSprites
    }
    
    public reset(hk: HeroKind, firstEndDay: boolean) {
        // Place sprite on the rooster
        console.log("ht resetting for", hk, firstEndDay)
        var extraShift = firstEndDay ? 0 : htShift;
        if (hk == HeroKind.Archer || hk == HeroKind.Mage) {
            this.heroSprites.get(hk).x = htX-20-extraShift;
        } else {
            this.heroSprites.get(hk).x = htX+20-extraShift;
        }
    }

    public resetAll() {
        console.log(this.heroSprites);
        this.heroSprites.forEach((sprite, heroKind) => {
            if (heroKind == HeroKind.Archer || heroKind == HeroKind.Mage) {
                sprite.x = htX-20;
            } else {
                sprite.x = htX+20;
            }
        })
    }

    public incHour(hk: HeroKind) {
        var shift = this.heroSprites.get(hk).x < htX-20 ? htShift*2 : htShift;
        this.heroSprites.get(hk).x += shift;
        console.log(hk, "ht inc", this.heroSprites.get(hk).x);

        // acui: gross hack for hours 8, 9 and 10
        if ((hk == HeroKind.Warrior || hk == HeroKind.Dwarf) && this.heroSprites.get(hk).x == 2060) {
            this.heroSprites.get(hk).x += 40;
        } else if (this.heroSprites.get(hk).x == 2020) {
            this.heroSprites.get(hk).x += 40;
        }
    }
}