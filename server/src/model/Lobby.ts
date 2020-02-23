import { Player } from './player';
import { Game } from './Game';

export class Lobby {
    private players: Map<string, Player>
    private games: Map<string, Game>

    constructor(){
        this.players = new Map<string, Player>();
        this.games = new Map<string, Game>();
    }

    public createGame(g: Game){
        this.games.set(g.getName(), g);
    }

    public connectNewPlayer(id: string){
        let player = new Player(id);
        this.players.set(id, player)
        return player.getID();
    }

    public disconnectPlayer(id: string){
        this.players.delete(id);
    }

    public getPlayers(){
        return this.players;
    }
     
    public getAvailableGames(){
        return this.games;
    }

}