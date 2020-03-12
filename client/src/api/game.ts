import { BASE_API } from "../config/env"
import * as io from "socket.io-client";

export class game {
    private name: string;
    private socket;
    private chatlog: any;

    constructor(name) {
        this.name = name
        this.socket = this.connect(this.name)
        this.chatlog = []
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
    
    public useWell(callback) {
        this.socket.emit("useWell", callback);
    }

    public updateWell(callback) {
        this.socket.on("updateWell", callback);
    }

    public updateDropGold(callback) {       
        this.socket.on("updateDropGold", callback);       
    }

    public dropGold(callback) {
        //console.log("hereeeee2") //is printed
        this.socket.emit("dropGold", callback)
    }

    public send(msg, callback) {
        this.socket.emit("send message", msg, callback);
    }

    public recieve(callback) {
        // prevent registering event again and creating double callbacks.
        if(!this.socket._callbacks["$update messages"])
            this.socket.on("update messages", callback);
    }

    public getChatLog() {
        return this.chatlog
    }

    public appendToChatLog(msg) {
        this.chatlog.push(msg)
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

    public getHerosBorder(callback){
        this.socket.emit("getHerosBorder", callback)
    }

    public getHeroAttributes(type, callback){
        this.socket.emit("getHeroAttributes", type, callback)
    }

    // Collaborative decision making
    // Submitting a decision
    public collabDecisionSubmit() {
        this.socket.emit('collabDecisionSubmit')
    }
    public receiveDecisionSubmitSuccess(callback) {
        this.socket.on('sendDecisionSubmitSuccess', callback)
    }
    public receiveDecisionSubmitFailure(callback) {
        this.socket.on('sendDecisionSubmitFailure', callback)
    }
    // Accepting a decision
    public collabDecisionAccept() {
        this.socket.emit('collabDecisionAccept')
    }
    public receiveDecisionAccepted(callback) {
        this.socket.on('sendDecisionAccepted', callback)
    }
}

