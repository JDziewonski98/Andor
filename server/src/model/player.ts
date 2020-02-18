
export class Player {
    private readyToPlay: boolean;
    private id: string;

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
}