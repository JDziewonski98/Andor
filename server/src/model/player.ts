import UUID from '../utils/UUID';

export class Player {
    private readyToPlay: boolean;
    private id: string;

    constructor(){
        this.readyToPlay = false;
        this.id = UUID.generate();
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
}