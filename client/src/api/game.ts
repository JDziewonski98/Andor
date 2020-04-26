import { BASE_API } from "../config/env"
import * as io from "socket.io-client";

export class game {
    private name: string;
    private socket;
    private chatlog: any;
    // private myTurn: boolean;

    constructor(name) {
        this.name = name
        this.socket = this.connect(this.name)
        this.chatlog = []
        // this.myTurn = false;
    }

    private connect(name) {
        return io.connect(BASE_API + `/${name}`);
    }

    public getGameData(callback){
        this.socket.emit("getGameData", callback);
    }
 
    public bindHeroForSelf(herotype, callback) {
        this.socket.emit("bind hero", herotype, callback)
    }

    public updateHeroList(callback){
        this.socket.on("updateHeroList", callback)
    }

    public getAvailableHeros(callback){
        this.socket.emit("getAvailableHeros", callback);
    }

    public pickupFarmer(tileID: number, callback){
        this.socket.emit("pickupFarmer",  tileID, callback);
    }

    public destroyFarmer(callback){
        this.socket.on("destroyFarmer", callback);
    }

    public killHeroFarmers(callback) {
        this.socket.on("killHeroFarmers", callback);
    }

    public unsubscribeKillHeroFarmers() {
        this.socket.off("killHeroFarmers");
    }

    public addFarmer(callback){
        this.socket.on("addFarmer", callback);
    }

    public dropFarmer(callback){
        this.socket.emit("dropFarmer", callback);
    }

    public merchant(item: string, callback){
        this.socket.emit("merchant", item, callback);
    }

    public getNumBrews(callback) {
        this.socket.emit("getNumBrews", callback);
    }

    public purchaseBrew() {
        this.socket.emit("purchaseBrew");
    }

    public updateNumBrews(callback) {
        this.socket.on("updateNumBrews", callback);
    }

    public disconnectUpdateNumBrews() {
        this.socket.off("updateNumBrews");
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


    /*
    * NARRATOR RELATED
    */
    public getNarratorPosition(callback) {
        this.socket.emit("getNarratorPosition", callback);
    }

    // updates ui position of narrator pawn and triggers client-side updates
    public updateNarrator(callback) {
        this.socket.on("updateNarrator", callback);
    }

    public placeRuneStoneLegend() {
        this.socket.emit("placeRuneStoneLegend");
    }

    public updateRunestoneLegend(callback) {
        this.socket.on("updateRunestoneLegend", callback);
    }

    public revealRunestone(tileID: number, stoneName: string) {
        this.socket.emit("revealRunestone", tileID, stoneName);
    }

    // TODO: REMOVE, FOR NARRATOR TESTING ONLY
    public advanceNarrator() {
        this.socket.emit("advanceNarrator");
    }
    /////////////////////////////

    /*
    *   GOLD RELATED
    */
    public getTileGold(tileID, callback) {
        this.socket.emit("getTileGold", tileID, callback);
    }
    public dropGold() {
        this.socket.emit("dropGold")
    }
    public pickupGold(id) {
        this.socket.emit("pickupGold", id)
    }

    // Updates for HeroWindows
    public updateDropGold(callback) {
        this.socket.on("updateDropGold", callback);       
    }
    public updatePickupGold(callback) {
        this.socket.on("updatePickupGold", callback)
    }
    public disconnectUpdateDropGold() {
        this.socket.off("updateDropGold")
    }
    public disconnectUpdatePickupGold() {
        this.socket.off("updatePickupGold")
    }

    // Updates for TileWindows
    public updateDropGoldTile(callback) {
        this.socket.on("updateDropGoldTile", callback);       
    }
    public updatePickupGoldTile(callback) {
        this.socket.on("updatePickupGoldTile", callback)
    }
    public disconnectUpdateDropGoldTile() {
        this.socket.off("updateDropGoldTile")
    }
    public disconnectUpdatePickupGoldTile() {
        this.socket.off("updatePickupGoldTile")
    }
    /////////////////////////////

    /*
    *   DROP AND PICKUP ITEMS
    */
   
    // itemsMap is an object that maps item names to their quantities
    public getTileItems(tileID: number, callback) {
        this.socket.emit("getTileItems", tileID, callback);
    }
    public dropItem(itemName: string, itemType: string) {
        this.socket.emit("dropItem", itemName, itemType);
    }
    public pickupItem(tileID: number, itemName: string, itemType: string) {
        this.socket.emit("pickupItem", tileID, itemName, itemType)
    }

    // Updates for HeroWindows
    public updateDropItemHero(callback) {
        this.socket.on("updateDropItemHero", callback);       
    }
    public updatePickupItemHero(callback) {
        this.socket.on("updatePickupItemHero", callback)
    }
    public disconnectUpdateDropItemHero() {
        this.socket.off("updateDropItemHero")
    }
    public disconnectUpdatePickupItemHero() {
        this.socket.off("updatePickupItemHero")
    }

    // Updates for TileWindows
    public updateDropItemTile(callback) {
        this.socket.on("updateDropItemTile", callback);       
    }
    public updatePickupItemTile(callback) {
        this.socket.on("updatePickupItemTile", callback)
    }
    public disconnectUpdateDropItemTile() {
        this.socket.off("updateDropItemTile")
    }
    public disconnectUpdatePickupItemTile() {
        this.socket.off("updatePickupItemTile")
    }
    /////////////////////////////

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
        // moved turn validation to backend
        // if(this.myTurn){
            this.socket.emit('moveRequest', tileID, callback)
        // }
    }

    public updateMoveRequest(callback){
        this.socket.on("updateMoveRequest", callback);
    }

    public movePrinceRequest(tileID, callback){
        // if(this.myTurn){
            this.socket.emit('movePrinceRequest', tileID, callback)
        // }
    }

    public updateMovePrinceRequest(callback){
        this.socket.on("updateMovePrinceRequest", callback);
    }

    public getAdjacentTiles(centraltileid, callback) {
        this.socket.emit('getAdjacentTiles',centraltileid, callback)
    }

    /*
    *  TURN LOGIC
    */
    // Note: this is not used when a hero's turn ends because they ended their day.
    // Logic for turn end on end day is handled on the server.
    public getCurrPlayersTurn(callback) {
        this.socket.emit("getCurrPlayersTurn", callback);
    }
    
    public endTurn() {
        // The hero that gets the next turn depends on whether the day is over for all heroes
        this.socket.emit('endTurn');
        // this.myTurn = false;
    }

    public telescopeEndTurn() {
        this.socket.emit('telescopeEndTurn');
    }

    public updatePassTurn(callback) {
        this.socket.on("updatePassTurn", callback);
    }

    // **** DEPRECATED 04/20/20: removed turn logic from frontend ***
    // public getTurn() {
    //     return this.myTurn
    // }

    // public endTurnOnEndDay() {
    //     this.myTurn = false;
    // }
    
    // public yourTurn(){
    //     var self = this
    //     this.socket.on("yourTurn", function() {
    //         self.myTurn = true
    //     })
    // }

    // public setMyTurn(b:boolean){
    //     this.myTurn = b;
    // }
    /////////////////////////////

    public removeListener(object){
        console.log('removing ', object)
        this.socket.emit('removeListener',object)
    }

    public removeObjListener(callback) {
        this.socket.on('removeObjListener', callback)
    }

    public allPlayersReady(callback) {
        this.socket.emit('allPlayersReady', callback)
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
    //Initiating new collabs
    public newCollabListener(callback){
        this.socket.on('newCollab', callback)
    }
    //Sharing info between clients
    public sendIncResource(resourceHeroKind, resourceIndex){
        this.socket.emit('sendIncResource', resourceHeroKind, resourceIndex)
    }
    public incListener(callback){
        this.socket.on('receiveIncResource', callback)
    }
    public sendDecResource(resourceHeroKind, resourceIndex){
        this.socket.emit('sendDecResource', resourceHeroKind, resourceIndex)
    }
    public decListener(callback){
        this.socket.on('receiveDecResource', callback)
    }

    //accepts
    public sendAccept(heroKind){
        this.socket.emit('sendAccept', heroKind)
    }
    public acceptListener(callback){
        this.socket.on("receiveAccept", callback)
    }
    //removeAcceptListener is not implemented yet
    // public removeAcceptListener(callback){
    //     this.socket.on("receiveRemoveAccept", callback)
    // } 

    //ending collabs
    public sendEndCollab(convMap, resourceNames, involvedHeroes, eventID){
        this.socket.emit('sendEndCollab', convMap, resourceNames, involvedHeroes, eventID)
    }
    public endCollabListener(callback){
        this.socket.on('receiveEndCollab',callback)
    }
    public unsubscribeListeners() {
        //must be called once youre done using the collab decision listeners.
        this.socket.off('receiveIncResource')
        this.socket.off('receiveDecResource')
        this.socket.off('receiveAccept')
        //this.socket.off('receiveRemoveAccept) this is not implemented yet
        this.socket.off('receiveEndCollab')

    }


    ////
    //Removing wells from game
    public removeWell(callback){
        this.socket.on('removeWell', callback)
    }

    ////
    //Add temporary merchant to tile 9
    public addCoastalTrader(callback){
        this.socket.on('addCoastalTrader', callback)
    }
    public removeCoastalTrader(callback){
        this.socket.on('removeCoastalTrader', callback)
    }
    public buyFromCoastalTrader(){
        this.socket.emit("buyFromCoastalTrader")
    }

    /////////////////////////////

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
    /////////////////////////////

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

    public resetMonsterStats(name) {
        this.socket.emit('resetMonsterStats', name)
    }

    public doDamageToHero(hero, damage, callback = null) {
        this.socket.emit('doDamageToHero', hero, damage, callback)
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
    
    public sendCollabApproveToBattleAllies(windowname, involvedHeros, res) {
        this.socket.emit('battleCollabApprove', windowname, involvedHeros, res)
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

    public unsubscribeShieldListeners() {
        this.socket.off('receiveShieldResp');
    }

    public sendDeathNotice(hero) {
        this.socket.emit('deathNotice', hero)
    }

    public receiveDeathNotice(callback) {
        this.socket.on('receiveDeathNotice', callback)
    }

    public updateHourTracker(hero) {
        this.socket.emit('updateHeroTracker', hero)
    }
    public receiveUpdateHeroTracker(callback) {
        this.socket.on('receiveUpdateHeroTracker', callback)
    }

    public sendShieldPrompt(hero, shield_damaged, potentialdamage, yourself) {
        this.socket.emit('sendShieldPrompt', hero, shield_damaged, potentialdamage, yourself)
    }

    public receiveShieldPrompt(callback) {
        this.socket.on('receiveShieldPrompt', callback)
    }

    public sendShieldResp(herotype, resp) {
        this.socket.emit('sendShieldResp',herotype, resp)
    }

    public receiveShieldResp(callback) {
        this.socket.on('receiveShieldResp', callback)
    }

    //ask allies if they want to continue fight
    public continueFightRequest(herotype) {
        this.socket.emit('continueFightRequest', herotype)
    }

    //listener in host client for allied heros responses
    public receiveContinueFight(callback) {
        this.socket.on('receiveContinueFight', callback)
    }

    //called before closing host fight window
    public unsubscribeContFight() {
        this.socket.off('receiveContinueFight')
    }

    //sent from server to open the window asking allies if they want to continue fight
    public continueFightPrompt(callback) {
        this.socket.on('continueFightPrompt', callback);
    }

    //sent from ally's client to server to inform host of decision
    public sendContinueFight(response, herotype) {
        this.socket.emit('sendContinueFight',response, herotype)
    }

    //message that force starts a heros turn and force starts a fight with target monster
    public forceContinueFight(herokind, monstername){ 
        this.socket.emit('forceContinueFight', herokind, monstername)
    }

    public forceFight(callback) {
        this.socket.on('forceFight', callback)
    }

    public forceTurn(callback) {
        this.socket.on('forceTurn', callback)
    }
    /////////////////////////////


    /////////////////////////////
    //  Trade stuff + item stuff
    ////////////////////////////

    public validateTrade(hero1, hero2, hero1receives, hero2receives, callback) {
        this.socket.emit('validateTrade', hero1, hero2, hero1receives, hero2receives, callback)
    }

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

    public submitOffer(youroffers){
        this.socket.emit('submitOffer', youroffers)
    }

    public receiveOffer(callback) {
        this.socket.on('receiveOffer',callback)
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

    public receiveUseWineskin(callback) {
        this.socket.on('receiveUseWineskin', callback);
    }

    public disconnectReceiveUseWineskin() {
        this.socket.off('receiveUseWineskin');
    }

    public executeTrade(hero, items_given, items_gained) {
        this.socket.emit('executeTrade', hero, items_given, items_gained)
    }

    public tradeDone() {
        this.socket.emit('tradeDone')
    }

    public endTradeListener(callback) {
        this.socket.on('endTrade', callback)
    }

    public unsubscribeTradeListeners() {
        this.socket.off('receiveOffer')
        this.socket.off('receiveTradeOfferChanged')
        this.socket.off('endTrade')
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
        this.socket.on("addMonster", callback);
    }

    public revealWitch(callback) {
        this.socket.on("revealWitch", callback);
    }

    public revealHerb(callback) {
        this.socket.on("revealHerb", callback);
    }

    public removeHerb(callback) {
        this.socket.on("removeHerb", callback);
    }
    ///////////////////////////
    /*
    *   Event Cards
    */
    public newEventListener(callback){
        this.socket.on("newEvent", callback)
        
    }
    //////

    public receivePlayerDisconnected(callback){
        this.socket.on("receivePlayerDisconnected", callback)
    }

    /*
    *   END OF GAME
    */
    public receiveEndOfGame(callback) {
        this.socket.on('endGame', callback);
    }

    public save(){
        this.socket.emit("save");
    }

    // GAME LOG
    public updateGameLog(callback) {
        this.socket.on("updateGameLog", callback);
    }
}

