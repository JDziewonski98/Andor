import { BASE_API } from "../config/env"
import * as io from "socket.io-client";

export class game {
    private name: string;
    private socket;
    private chatlog: any;

    constructor(name) {
        this.name = name
        this.socket = this.connect(this.name)
    }

    private connect(name) {
        return io.connect(BASE_API + `/${name}`);
    }

    public bindHero(herotype) {
        this.socket.emit("bind hero", herotype)
    }

    public send(msg, callback) {
        this.socket.emit("send message", msg, callback);
    }
    
    public recieve(callback) {
        this.socket.on("update messages", callback);
    }

    public getChatLog(callback) {
        this.socket.emit('getChatLog', callback)
    }

}

