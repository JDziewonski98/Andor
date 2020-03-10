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

    public bindHeroForSelf(herotype, callback) {
        this.socket.emit("bind hero", herotype, callback)
    }

    public updateHeroList(callback){
        this.socket.on("updateHeroList", callback)
    }

    public pickupFarmer(callback){
        this.socket.emit("pickupFarmer",  callback);
    }

    public updateFarmer(callback){
        this.socket.on("updateFarmer", callback);
    }

    public merchant(callback){
        this.socket.emit("merchant", callback);
    }
    
    public dropGold(amount, callback) {
        this.socket.emit("dropGold", amount, callback)
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

    // TODO movement
    public moveTo(tile, callback){
        this.socket.emit('moveRequest', tile, callback)
    }

    public  removeListener(object){
        console.log('removing ', object)
        this.socket.emit('removeListener',object)
    }

    public removeObjListener(callback) {
        this.socket.on('removeObjListener', callback)
    }

    public playerReady() {
        this.socket.emit('playerReady')
    }

    public getReadyPlayers() {
        this.socket.emit('getReadyPlayers')
    }

    public recieveReadyPlayers(callback) {
        this.socket.on('sendReadyPlayers', callback)
    }

    public getDesiredPlayerCount() {
        this.socket.emit('getDesiredPlayerCount')
    }  

    public recieveDesiredPlayerCount(callback) {
        this.socket.on('recieveDesiredPlayerCount', callback)
    }

    public getHeros(callback){
        this.socket.emit("getHeros", callback)
    }

    public getHeroAttributes(callback){
        this.socket.emit("getHeroAttributes", callback)
    }

    // Collaborative decision making
    public collabDecisionAccept() {
        this.socket.emit('collabDecisionAccept')
    }

    public receiveDecisionAccepted(callback) {
        this.socket.on('sendDecisionAccepted', callback)
    }
}

