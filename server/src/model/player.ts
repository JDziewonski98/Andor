import { Hero } from './hero';
import { HeroKind } from './HeroKind';

export class Player {
    private readyToPlay: boolean;
    private id: string;
    private hero;

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

    public createHero(herotype: HeroKind) {
        this.hero = new Hero(herotype, 1, 3, 3, 3);
    }

    public getHero() {
        return this.hero;
    }
}