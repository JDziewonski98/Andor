import { BASE_API } from "../config/env"
import * as io from "socket.io-client";

export class lobby {
    private socket;

    constructor(){
        this.socket = this.connect()
    }

    private connect() {
        return io.connect(BASE_API + "/lobby");
    }


    public addNewPlayerToLobby() {
        this.socket.emit("newPlayer");
    }
    
    public createGame(name, numPlayers, difficulty){
        this.socket.emit("createGame", name, numPlayers, difficulty)
    }
    
    public getGames(callback){
        this.socket.emit("getGames", callback)
    }

    public addPlayerToGame(name, callback){
        this.socket.emit("joinGame", name, callback)
    }

    public recieveGames(callback) {
        this.socket.on('recieveGames', callback);
    }

    public loadGame(name, callback){
        this.socket.emit("loadGame", name, callback);
    }
}




