import { BASE_API } from "../config/env"
import * as io from "socket.io-client";

export class game {
    private name: string;
    private socket;
    private chatlog: any;
    private myTurn: boolean;

    constructor(name) {
        this.name = name
        this.socket = this.connect(this.name)
        this.chatlog = []
        this.myTurn = false;
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

    public destroyFarmer(callback){
        this.socket.on("destroyFarmer", callback);
    }


    public addFarmer(callback){
        this.socket.on("addFarmer", callback);
    }

    public dropFarmer(callback){
        this.socket.emit("dropFarmer", callback);
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
        console.log("here2") //is printed at user console
        this.socket.emit("dropGold", callback)
    }

    public pickupGold(callback) {
        console.log("api pickupGold()") //is printed
        this.socket.emit("pickupGold", callback)
    }

    public updatePickupGold(callback) {
        this.socket.on("updatePickupGold", callback)
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
    public moveRequest(tileID, callback){
        if(this.myTurn){
            this.socket.emit('moveRequest', tileID, callback)
        }
    }
    public updateMoveRequest(callback){
        this.socket.on("updateMoveRequest", callback);
    }

    public endTurn(){
        if(this.myTurn){
            console.log("You have ended your turn.")
            this.socket.emit('endTurn');
            this.myTurn = false;
        }
    }
    
    public yourTurn(){
        var self = this
        this.socket.on("yourTurn", function() {
            console.log("It is now your turn.")
            self.myTurn = true
        })
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

    public getNumSheilds(callback){
        this.socket.emit("getNumSheilds", callback)
    }

    public getHeroAttributes(type, callback){
        this.socket.emit("getHeroAttributes", type, callback)
    }

    // Collaborative decision making
    // Submitting a decision
    public collabDecisionSubmit(resAllocated, resNames, involvedHeroes) {
        this.socket.emit('collabDecisionSubmit', resAllocated, resNames, involvedHeroes)
    }
    public receiveDecisionSubmitSuccess(callback) {
        this.socket.on('sendDecisionSubmitSuccess', callback)
    }
    public unsubscribeListeners() {
        //must be called once youre done using the collab decision listeners.
        this.socket.off('sendDecisionSubmitSuccess')
        this.socket.off('sendDecisionSubmitFailure')
        this.socket.off('sendDecisionAccepted')
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

    public killMonster(monstername) {
        this.socket.emit('killMonster', monstername)
    }

    public rollMonsterDice(monstername, callback) {
        this.socket.emit('monsterRoll', monstername, callback)
    }
    public setMyTurn(b:boolean){
        this.myTurn = b;
    }
    public getMonsterStats(monstername, callback) {
        this.socket.emit('getMonsterStats', monstername, callback)
    }

    // End of day
    public moveMonstersEndDay() {
        console.log("send move monsters to server");
        this.socket.emit('moveMonstersEndDay');
    }

    public receiveUpdatedMonsters(callback) {
        this.socket.on('sendUpdatedMonsters', callback);
    }

    public receiveKilledMonsters(callback) {
        this.socket.on('sendKilledMonsters', callback)
    }
}

