import { Window } from "./window";
import { game } from "../api/game";
import { WindowManager } from "../utils/WindowManager";
import {CollabWindow} from "./collabwindow"
import {
    reducedWidth, reducedHeight, collabColWidth, collabRowHeight
  } from '../constants'

export class Fight extends Window {
    private gameinstance: game;
    private windowname;
    //texts
    private fighttext;
    private theirroll;
    private notificationtext
    private yourroll;
    private yourwill;
    private yourwilltxt;
    private alliedrollstxt
    private monsterstrtxt
    private monsterwilltxt
    private monstergoldtxt
    private monstertypetxt
    private exitbutton
    //monster stats and attributes
    private monstername;
    private monstertexture;
    private monstericon
    private monsterstr
    private monsterwill
    private monstergold
    private monstertype
    //hero and monster references
    private monster
    private hero
    private alliedheros: string[] = []
    private actuallyjoinedheros: string[] = []
    private allyrolls: Map<string, number>
    private yourattack;


    public constructor(key, data, windowData = { x: 10, y: 10, width: 450, height: 350 }) {
        super(key, windowData);
        console.log(data)
        this.windowname = key
        this.gameinstance = data.controller
        this.monstertexture = data.monster.texture
        this.monstername = data.monster.name
        this.hero = data.hero
        this.monster = data.monster
        this.yourwill = this.hero.getWillPower()
        var self = this
        this.allyrolls = new Map<string,number>();
        this.gameinstance.getHerosInRange(this.monster.tile.id, (heros) =>
        {
            for (let i = 0; i < heros.length; i++) {
                if (heros[i] == this.hero.getKind()){
                    heros.splice(i,1)
                }
            }
            self.alliedheros = heros
            console.log('possible allies: ' , this.alliedheros)
        })
    }


    protected initialize() {
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        bg.tint = 0xff0000
        this.monstericon = this.add.image(40,40,this.monstertexture)

        //fetch monster stats from backend
        this.gameinstance.getMonsterStats(this.monstername, function(data) {
            self.monsterstr = data.str;
            self.monsterwill = data.will;
            self.monstergold = data.reward;
            self.monstertype = data.type;
            self.monstertypetxt = self.add.text(3,80,self.monstertype)
            self.monsterstrtxt = self.add.text(3,95,"Str: " + self.monsterstr)
            self.monsterwilltxt = self.add.text(3,110,"Will: " + self.monsterwill)
            self.monstergoldtxt = self.add.text(3,125,"Reward: " + self.monstergold)
        })

        //populate window with text
        this.notificationtext = this.add.text(90,215, '', { backgroundColor: '#3b44af' })
        this.fighttext = this.add.text(90, 20, 'Fight!!', { backgroundColor: '#363956' }).setInteractive()
        this.theirroll = this.add.text(90, 60, 'Monster roll: ', { backgroundColor: 'fx00' })
        this.yourroll = this.add.text(90, 110, 'Your roll: ', { backgroundColor: 'fx00' })
        this.alliedrollstxt = this.add.text(90, 160, 'Allied rolls: ', { backgroundColor: 'fx00' })
        this.yourwilltxt = this.add.text(90, 200, 'Your will: ' + this.yourwill, { backgroundColor: 'fx00' })

        //click the fight text to enter the fight.
        this.fighttext.on('pointerdown', function (pointer) {
            //TODO get rid of X and invite text.
            self.fighttext.setText('Fight again!')
            self.fighttext.disableInteractive()
            self.gameinstance.rollMonsterDice(self.monstername, function(result) {

                if (result != 'outofrange'){
                    var alliedrollstxtreceived = 0
                    console.log('fighting!!')
                    self.theirroll.setText('Monster roll: ' + result)

                    //click to get your roll.
                    //TODO implement abilities
                    var rollbutton = self.add.text(220, 110, 'ROLL.').setInteractive()
                    rollbutton.on('pointerdown', function(pointer) {
                        self.gameinstance.heroRoll(function(data) {
                            if (self.hero.getKind() == 'archer') {
                                //TODO
                            }
                            else {
                                rollbutton.setText('Rolled.')
                                rollbutton.disableInteractive()
                                let attack = data.roll + data.strength
                                self.yourattack = attack
                                self.yourroll.setText('Your roll: ' + attack)
                                if (self.hero.getKind() == 'mage') {
                                    //TODO
                                }
                            }
                        })
                    })

                    //listener for ally's rolls...
                    self.gameinstance.receiveAlliedRoll(function(herokind, roll,str) {
                        console.log('received', herokind, ' roll.')
                        alliedrollstxtreceived++
                        self.actuallyjoinedheros.push(herokind)
                        self.allyrolls.set(herokind,roll+str)
                        self.alliedrollstxt.setText(self.alliedrollstxt.getWrappedText() + self.allyrolls.get(herokind))
                        if(alliedrollstxtreceived == self.alliedheros.length) {
                            console.log('all allies have confirmed their roll.')
                        }
                    })

                    //confirm you want to use your current roll and ally's rolls.
                    var confirmbutton = self.add.text(300,300,'Confirm.').setInteractive()
                    confirmbutton.on('pointerdown', function(pointer) {
                        //TODO handle re-inviting allies
                        //TODO hide confirm button, flash fight again button, reopen invite list.
                        self.fighttext.setInteractive()
                        self.gameinstance.unsubscribeAlliedRollListener()
                        var alliedattacksum = 0;

                        for (let ally of self.alliedheros) {
                            try{
                                alliedattacksum += self.allyrolls.get(ally)
                            }
                            catch{
                                console.log(ally, ' not participating')
                            }
                        }

                        let totalattack = self.yourattack + alliedattacksum
                        if (totalattack > result) {
                            //todo handle reinvite
                            self.hero.incrementHour()
                            self.gameinstance.doDamageToMonster(self.monstername, totalattack - result)
                            self.notificationtext.setText('WHAM!! You hit them for \n' + (totalattack - result) + ' damage!')
                            self.tween()
                            self.monsterwill = self.monsterwill - (totalattack - result)
                            self.monsterwilltxt.setText('Will: ' + self.monsterwill)
                            if (self.monsterwill < 1) {
                                self.victory()
                            }
                        }
                        else if (totalattack < result){
                            //TODO handle allies dying
                            //do damages on backend. this also handles death backend wise.
                            self.gameinstance.doDamageToHero(self.hero.getKind(), result - totalattack)
                            for (let ally of self.actuallyjoinedheros){
                                self.gameinstance.doDamageToHero(ally, result - totalattack)
                            }
                            self.hero.setwillPower(-(result-totalattack))
                            self.yourwill = self.hero.getWillPower()
                            self.yourwilltxt.setText('Your will: ' + self.yourwill)
                            self.notificationtext.setText('OUCH!! You take \n' + (result - totalattack) + ' damage!')
                            self.tweentext()
                            if (self.hero.getWillPower() < 1) {
                                self.hero.resetWillPower()
                                self.hero.setStrength(-1)
                                self.death()
                            }
                        }
                        else {
                            //TODO tie
                            self.hero.incrementHour()
                            self.notificationtext.setText('Tie! You are \nevenly matched...')
                        }
                    })

                }

                else {
                    self.notificationtext.setText('Out Of Range!')
                }

            })
        })

        let style = {
            fontFamily: '"Roboto Condensed"',
            fontSize: "30px",
            color: "#4944A4"
        }
        this.exitbutton = this.add.text(300, 10, 'X', style).setInteractive()
        this.exitbutton.on('pointerdown', function(pointer) {
            self.scene.resume("Game")
            self.scene.remove(self.windowname)
        })
        this.displayInvList()
    }


    private displayInvList() {
        var self = this
        //display possible players to invite to the game.
        var invitetext = this.add.text(250,50, 'Click to see allies in range.').setInteractive()
        invitetext.on('pointerdown', function(pointer) {
            if (self.alliedheros.length > 0) {
                //iterate over other heros in range.
                for (let i = 0; i < self.alliedheros.length; i++) {
                    //display them in the window.
                    let invhero = self.add.text(250, 65 + (15*i), self.alliedheros[i])
                    //once weve displayed all heroes in range...
                    if (i == self.alliedheros.length - 1){ 
                        let style = {fontFamily: '"Roboto Condensed"',color: "#4944A4"}
                        var sendrequesttext = self.add.text(250, 65+(15*i)+15, 'Click me to invite!',style).setInteractive()
                        //this will display a invite request pop-up on the clients of all heroes in range.
                        sendrequesttext.on('pointerdown', function(pointer) {
                            sendrequesttext.setText('Invites sent.')
                            sendrequesttext.disableInteractive()
                            self.gameinstance.sendBattleInvite(self.monster.tile.id, self.alliedheros)
                            self.gameinstance.receiveBattleInviteResponse(function(response, herokind) {
                                if (response == 'yes' )  {
                                    console.log('yes ' + herokind)
                                    //this hero is joining the battle. we will have to roll for them and add their roll.
                                }
                            })
                        })
                    }
                }
            }
            else {
                this.setText('No other \nplayers in\nrange.')
            }
        })
    }


    public tween() {
        //  Flash the mosntericon
        this.fighttext.disableInteractive()
        this.monstericon.setTint('#000000')
        this.tweens.add({
            targets: this.monstericon,
            alpha: 0.2,
            duration: 160,
            ease: 'Power3',
            yoyo: true
        });
        this.monstericon.clearTint()
        this.fighttext.setInteractive()
    }


    public tweentext() {
        this.fighttext.disableInteractive()
        this.tweens.add({
            targets: this.notificationtext,
            alpha: 0.2,
            duration: 160,
            ease: 'Power3',
            yoyo: true
        });
        this.fighttext.setInteractive()
    }


    private victory() {
        var self = this
        this.monster.destroy()
        this.yourwilltxt.destroy()
        this.monstertypetxt.destroy()
        this.monsterstrtxt.destroy()
        this.monsterwilltxt.destroy()
        this.monstergoldtxt.destroy()
        this.monstericon.destroy()
        this.notificationtext.destroy()
        this.fighttext.destroy()
        this.theirroll.destroy()
        this.yourroll.destroy()
        this.exitbutton.destroy()

        let vic = this.add.text(70,20,"VICTORY!")
        this.tweens.add({
            targets: vic,
            alpha: 0.3,
            duration: 220,
            ease: 'Power3',
            yoyo: true
        });

        var goldtext = this.add.text(70,50,"Click to loot " + this.monstergold + " gold.").setInteractive()
        var willtext = this.add.text(70,80,"Click to plunder " + this.monstergold + "  willpower.").setInteractive()
        
        goldtext.on('pointerdown', function(pointer) {

            var res = new Map([
                ["gold", self.monstergold]
              ])

            var width = (res.size + 1) * collabColWidth; 
            var height = (3) * collabRowHeight;

            var collabwindowdata = {
                controller: self.gameinstance,
                isOwner: true,
                heroes: [self.hero],
                resources: res,
                textOptions: null,
                x: reducedWidth / 2 - width / 2,
                y: reducedHeight / 2 - height / 2,
                w: 200,
                h: 100,
                infight: true
              }

            WindowManager.create(this, self.monstername + 'collab', CollabWindow, collabwindowdata)
            self.scene.remove(self.monstername)
        }, this)


        willtext.on('pointerdown', function(pointer) {
            var res = new Map([
                ["will", self.monstergold]
              ])

            var width = (res.size + 1) * collabColWidth;
            var height = (3) * collabRowHeight;

            var collabwindowdata = {
                controller: self.gameinstance,
                isOwner: true,
                heroes: [self.hero],
                resources: res,
                textOptions: null,
                x: reducedWidth / 2 - width / 2,
                y: reducedHeight / 2 - height / 2,
                w: 200,
                h: 100,
                infight: true
              }

            WindowManager.create(this, self.monstername + 'collab', CollabWindow, collabwindowdata)
            self.scene.remove(self.monstername)
        }, this)

        //deleting the monster.
        this.gameinstance.killMonster(self.monstername)
    }


    public death() {
        var self = this
        this.yourwilltxt.destroy()
        this.monstertypetxt.destroy()
        this.monsterstrtxt.destroy()
        this.monsterwilltxt.destroy()
        this.monstergoldtxt.destroy()
        this.monstericon.destroy()
        this.notificationtext.destroy()
        this.fighttext.destroy()
        this.theirroll.destroy()
        this.yourroll.destroy()
        this.exitbutton.destroy()
        this.add.text(70,50,"You lost and lose\n 1 strength. Your turn \n is over. Your \nwill is set to 3.")
        var text = this.add.text(70,150,"Click to accept.").setInteractive()
        text.on('pointerdown', function(pointer) {
            self.scene.remove(self.windowname)
            if (self.gameinstance.getTurn()) {
                self.gameinstance.endTurn();
            }
        })
    }

}