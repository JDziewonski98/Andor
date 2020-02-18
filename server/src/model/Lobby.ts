import { Player } from './player';

export class Lobby {
    private players: Set<Player>

    constructor(){
        this.players = new Set<Player>();
    }

    public connectPlayer(){
        let player = new Player();
        this.players.add(player)
    }


}