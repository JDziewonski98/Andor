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

    public getTurn() {
        return this.myTurn
    }

    public updateHeroList(callback){
        this.socket.on("updateHeroList", callback)
    }

    public getBoundHeros(callback){
        this.socket.emit("getBoundHeros", callback);
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
    
    // Server uses the passed callback to tell the calling client to update the well
    // Server broadcasts to update the other clients
    public useWell(callback) {
        this.socket.emit("useWell", callback);
    }

    public getFog(callback){
        this.socket.emit("getFog", callback);
    }

    public updateWell(callback) {
        this.socket.on("updateWell", callback);
    }

    public updateDropGold(callback) {       
        this.socket.on("updateDropGold", callback);       
    }

    public disconnectUpdateDropGold() {
        this.socket.off("updateDropGold")
    }

    public dropGold(callback) {
        console.log("here2") //is printed at user console
        this.socket.emit("dropGold", callback)
    }

    public pickupGold(id, callback) {
        console.log("api pickupGold()") //is printed
        this.socket.emit("pickupGold", id, callback)
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

    public moveRequest(tileID, callback){
        if(this.myTurn){
            this.socket.emit('moveRequest', tileID, callback)
        }
    }

    public updateMoveRequest(callback){
        this.socket.on("updateMoveRequest", callback);
    }

    /*
    *  TURN LOGIC
    */
    // Note: this is not used when a hero's turn ends because they ended their day.
    // Logic for turn end on end day is handled on the server.
    public endTurn(){
        // The hero that gets the next turn depends on whether the day is over for all heroes
        this.socket.emit('endTurn');
        this.myTurn = false;
    }

    public endTurnOnEndDay() {
        this.myTurn = false;
    }
    
    public yourTurn(){
        var self = this
        this.socket.on("yourTurn", function() {
            self.myTurn = true
        })
    }

    public setMyTurn(b:boolean){
        this.myTurn = b;
    }

    public removeListener(object){
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

    public getNumShields(callback){
        this.socket.emit("getNumShields", callback)
    }

    public updateShields(callback) {
        this.socket.on('updateShields', callback);
    }

    public getHeroAttributes(type, callback){
        this.socket.emit("getHeroAttributes", type, callback)
    }

    /*
    * COLLAB DECISIONS
    */
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

    /*
    * END DAY
    */
    public endDay(callback) {
        this.socket.emit('endDay', callback);
    }

    public moveMonstersEndDay() {
        this.socket.emit('moveMonstersEndDay');
    }

    public receiveUpdatedMonsters(callback) {
        this.socket.on('sendUpdatedMonsters', callback);
    }

    public resetWells(callback) {
        this.socket.emit("resetWells", callback);
    }

    public fillWells(callback) {
        this.socket.on("fillWells", callback);
    }

    public resetHours(callback) {
        this.socket.emit("resetHours", callback);
    }

    public receiveResetHours(callback) {
        this.socket.on("sendResetHours", callback);
    }

    //////////////////////////////
    // MONSTERS AND BATTLING
    /////////////////////////////
    public killMonster(monstername) {
        this.socket.emit('killMonster', monstername)
    }

    public rollMonsterDice(monstername, callback) {
        this.socket.emit('monsterRoll', monstername, callback)
    }
    
    public getMonsterStats(monstername, callback) {
        this.socket.emit('getMonsterStats', monstername, callback)
    }

    public receiveKilledMonsters(callback) {
        this.socket.on('sendKilledMonsters', callback)
    }

    public doDamageToHero(hero, damage) {
        this.socket.emit('doDamageToHero', hero, damage)
    }

    public doDamageToMonster(monstername, damage) {
        this.socket.emit('doDamageToMonster', monstername, damage)
    }

    public getHerosInRange(id, callback) {
        this.socket.emit('getHerosInRange',id,callback)
    }

    public sendBattleInvite(id, herosinrange) {
        this.socket.emit('sendBattleInvite', id, herosinrange)
    }

    public receiveBattleInvite(callback) {
        this.socket.on('receiveBattleInvite',callback)
    }

    public sendBattleInviteResponse(response, herokind) {
        //todo: have to clear this listener after use?
        this.socket.emit('sendBattleInviteResponse', response, herokind)
    }

    public receiveBattleInviteResponse(callback) {
        this.socket.on('recieveBattleInviteResponse', callback)
    }
    
    public sendCollabApproveToBattleAllies(windowname) {
        this.socket.emit('battleCollabApprove', windowname)
    }

    public battleRewardsPopup(callback) {
        this.socket.on('battleRewardsPopup',callback)
    }

    public unsubscribeBattleRewardsPopup() {
        this.socket.off('battleRewardsPopup')
    }

    public heroRoll(bow, callback) {
        this.socket.emit('heroRoll',bow , callback)
    }

    public confirmroll(herokind, roll, str) {
        this.socket.emit('confirmroll',herokind, roll, str)
    }

    public receiveAlliedRoll(callback) {
        this.socket.on('receiveAlliedRoll', callback)
    }

    public unsubscribeAlliedRollListener() {
        this.socket.off('receiveAlliedRoll')
        this.socket.off('recieveBattleInviteResponse')
    }

    public sendDeathNotice(hero) {
        this.socket.emit('deathNotice', hero)
    }

    public receiveDeathNotice(callback) {
        this.socket.on('receiveDeathNotice', callback)
    }
    /////////////////////////////


    /////////////////////////////
    //  Trade stuff + item stuff
    ////////////////////////////

    public sendTradeInvite(host, recipient) {
        this.socket.emit('sendTradeInvite', host, recipient)
    }

    public receiveTradeInvite(callback) {
        this.socket.on('receiveTradeInvite', callback)
    }

    public receiveTradeOfferChanged(callback) {
        this.socket.on('receiveTradeOfferChanged', callback)
    }

    public sendTradeOfferChanged(otherplayer, itemindex) {
        this.socket.emit('sendTradeOfferChanged', otherplayer, itemindex)
    }

    public getHeroItems(hero, callback) {
        this.socket.emit('getHeroItems', hero, callback)
    }

    public consumeItem(item) {
        //goal is to have backend determine item being consumed based on passed string
        this.socket.emit('consumeItem', item)
    }

    public useWineskin(half_or_full, callback) {
        //half_or_full must be either 'half' or 'full'
        this.socket.emit('useWineskin', half_or_full, callback)
    }



    /*
    *   FOGS
    */
    public useFog(fogType, tile, callback){
        this.socket.emit("useFog", fogType, tile, callback);
    }

    public destroyFog(callback){
        this.socket.on("destroyFog", callback);
    }

    public addMonster(callback){
        this.socket.on("addMonster", callback)
    }

    ///////////////////////////

    /*
    *   END OF GAME
    */
    public receiveEndOfGame(callback) {
        this.socket.on('endGame', callback);
    }
}

