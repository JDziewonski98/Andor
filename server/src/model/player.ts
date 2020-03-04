import { Hero } from './hero';
import { HeroKind } from './HeroKind';

export class Player {
    private readyToPlay: boolean;
    private id: string;
    private hero!: Hero;

    constructor(id: string){
        this.readyToPlay = false;
        this.id = id;
    }

    public getID(){
        return this.id;
    }

    public isReady(){
        return this.readyToPlay;
    }

    public setReady(state: boolean){
        this.readyToPlay = state;
    }

    public attachHero(hero: Hero) {
        this.hero = hero;
    }

    public getHero() {
        return this.hero;
    }
}