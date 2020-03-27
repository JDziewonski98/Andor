import { Window } from "./window";
import { game } from "../api/game";
import { WindowManager } from "../utils/WindowManager";
import { CollabWindow } from "./collabwindow"
import {
    reducedWidth, reducedHeight, collabColWidth, collabRowHeight
} from '../constants'

export class Fight extends Window {
    //  Class to display a fight window through which you can see mosnter stats and engage in a fight.
    //  The one starting the fight through this window can send invites to other allies in range.
    //  This player will also be the controller for resource distribution upon victory.
    //  There's some crap and redundancy in the code due to me angrily having to refactor it and copy pasting shit around, but it works.


    //shit ton of attributes mostly just text objects
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
    private invitetext;
    //for helm
    private otherdicetext;
    private helmtext;
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
    //misc
    private alliedheros: string[] = []
    private actuallyjoinedheros: string[] = []
    private allyrolls: Map<string, number>
    private yourattack: number;
    private heroobjectsforcollab
    private firstfight = true
    private inviteresponses = 0

    public constructor(key, data, windowData = { x: 10, y: 10, width: 500, height: 380 }) {
        super(key, windowData);
        console.log(data)
        this.windowname = key
        this.gameinstance = data.controller
        this.monstertexture = data.monster.texture
        this.monstername = data.monster.name
        this.hero = data.hero
        this.monster = data.monster
        this.yourwill = this.hero.getWillPower()
        this.heroobjectsforcollab = data.heroes
        this.allyrolls = new Map<string, number>();
        this.getPossibleAllies()
    }

    private getPossibleAllies() {
        var self = this
        this.gameinstance.getHerosInRange(this.monster.tile.id, (heros) => {
            for (let i = 0; i < heros.length; i++) {
                if (heros[i] == this.hero.getKind()) {
                    heros.splice(i, 1)
                }
            }
            self.alliedheros = heros
            console.log('possible allies: ', this.alliedheros)
        })
    }

    protected initialize() {
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        bg.tint = 0xff0000
        this.monstericon = this.add.image(40, 40, this.monstertexture)

        //fetch monster stats from backend
        this.gameinstance.getMonsterStats(this.monstername, function (data) {
            self.monsterstr = data.str;
            self.monsterwill = data.will;
            self.monstergold = data.reward;
            self.monstertype = data.type;
            self.monstertypetxt = self.add.text(3, 80, self.monstertype)
            self.monsterstrtxt = self.add.text(3, 95, "Str: " + self.monsterstr)
            self.monsterwilltxt = self.add.text(3, 110, "Will: " + self.monsterwill)
            self.monstergoldtxt = self.add.text(3, 125, "Reward: " + self.monstergold)
        })

        //populate window with text
        this.notificationtext = this.add.text(90, 215, '', { backgroundColor: '#3b44af' })
        this.fighttext = this.add.text(90, 20, 'Fight!!', { backgroundColor: '#363956' }).setInteractive()
        this.theirroll = this.add.text(90, 60, 'Monster atk: ', { backgroundColor: 'fx00' })
        this.yourroll = this.add.text(90, 110, 'Your atk: ', { backgroundColor: 'fx00' })
        this.alliedrollstxt = this.add.text(90, 160, 'Allied atks: ', { backgroundColor: 'fx00' })
        this.yourwilltxt = this.add.text(90, 200, 'Your will: ' + this.yourwill, { backgroundColor: 'fx00' })

        //click the fight text to enter the fight.
        this.fighttext.on('pointerdown', function (pointer) {
            self.inviteresponses = 0
            var haveyourolled = false
            self.alliedrollstxt.setText('Allied rolls: ')
            self.actuallyjoinedheros = []
            self.fighttext.setText('Fight again!')
            self.fighttext.disableInteractive()
            self.gameinstance.rollMonsterDice(self.monstername, function (result, bow) {
                if (self.gameinstance.getTurn() == false) {
                    console.log('case1')
                    self.notificationtext.setText('Not your Turn!')
                }
                else if (result != 'outofrange') {
                    console.log('case2')
                    //only generate the list of heroes in range text first time.
                    self.exitbutton.visible = false
                    if (self.firstfight == true) {
                        self.displayInvList()
                        self.firstfight = false
                    }
                    else {
                        self.sendInvites()
                    }

                    var alliedrollstxtreceived = 0
                    self.theirroll.setText('Monster roll: ' + result)

                    //click to get your roll.
                    var rollbutton = self.add.text(220, 123, 'ROLL.', { backgroundColor: '#3b44af' }).setInteractive()
                    rollbutton.on('pointerdown', function (pointer) {
                        haveyourolled = true
                        self.gameinstance.heroRoll(bow, function (data) {
                            //handle archer ability
                            var alldice = data.alldice
                            console.log('alldice', alldice)
                            //in case of archer or non-archer using a bow from adjacent space...
                            if (self.hero.getKind() == 'archer' || (bow)) {
                                var count = 0
                                var curroll = data.rolls[count]
                                var str = data.strength
                                self.notificationtext.setText('You may reroll ' + (data.rolls.length-1-count) + ' more times.')
                                self.yourroll.setText('Your roll: ' + curroll + ' Your str: ' + str)
                                rollbutton.setText('Click to use bow/archer ability.')
                                rollbutton.removeAllListeners('pointerdown')
                                self.yourattack = str + curroll
                                rollbutton.on('pointerdown', function(pointer) {
                                    count++
                                    self.notificationtext.setText('You may reroll ' + (data.rolls.length-1-count) + ' more times.')
                                    curroll = data.rolls[count]
                                    self.yourroll.setText('Your roll: ' + curroll + ' Your str: ' + str)
                                    self.yourattack = str + curroll
                                    if (count <= data.rolls.length - 1) {
                                        rollbutton.disableInteractive()
                                        rollbutton.destroy()
                                    }
                                })
                            }
                            else {
                                rollbutton.setText('Rolled.')
                                rollbutton.disableInteractive()
                                let attack = data.roll + data.strength
                                var str = data.strength
                                var urroll = data.roll
                                self.yourattack = attack
                                self.yourroll.setText('Your roll: ' + urroll + 'Your str: ' + str) 
                                //handle mage ability
                                if (self.hero.getKind() == 'mage') {
                                    rollbutton.setInteractive()
                                    rollbutton.removeAllListeners('pointerdown')
                                    var oppositeside = 7 - data.roll
                                    rollbutton.setText('Flip die to ' + oppositeside + '?')
                                    rollbutton.on('pointerdown', function(pointer){
                                        rollbutton.setText('Mage ability used.')
                                        rollbutton.disableInteractive()
                                        self.yourattack = oppositeside + data.strength
                                        urroll = oppositeside
                                        self.yourroll.setText('Your roll: ' + urroll + 'Your str: ' + str)
                                    })
                                }
                                else {
                                    //mage gets no benefit from helm, so offer helm option only for dwarf and warrior
                                    self.gameinstance.getHeroItems(self.hero.getKind(), function(itemdict) {
                                        if (itemdict['helm'] == 'true') {
                                            self.doHelm(alldice, str)
                                        }
                                        //TODO handle brew, herb, shield
                                    })
                                }
                            }
                        })
                    })

                    //listener for ally's rolls...
                    self.gameinstance.receiveAlliedRoll(function (herokind, roll, str) {
                        console.log('received', herokind, ' roll.')
                        alliedrollstxtreceived++
                        self.allyrolls.set(herokind, roll + str)
                        self.alliedrollstxt.setText(self.alliedrollstxt.getWrappedText() + '+' + self.allyrolls.get(herokind))
                        if (alliedrollstxtreceived == self.actuallyjoinedheros.length) {
                            console.log('all allies have confirmed their roll.')
                        }
                    })

                    //confirm you want to use your current roll and ally's rolls.
                    var confirmbutton = self.add.text(300, 300, 'Confirm.').setInteractive()
                    confirmbutton.on('pointerdown', function (pointer) {
                        if (alliedrollstxtreceived == self.actuallyjoinedheros.length && self.inviteresponses == self.alliedheros.length && haveyourolled == true) {
                            confirmbutton.destroy()
                            self.fighttext.setInteractive()
                            self.gameinstance.unsubscribeAlliedRollListener()
                            var alliedattacksum: number = 0;
                            rollbutton.destroy()
                            self.exitbutton.visible = true

                            for (let ally of self.alliedheros) {
                                try {
                                    if (self.actuallyjoinedheros.length > 0) {
                                        alliedattacksum += self.allyrolls.get(ally)
                                        console.log(self.allyrolls)
                                    }
                                }
                                catch{
                                    console.log(ally, ' not participating')
                                }
                            }

                            self.hero.incrementHour()
                            self.heroobjectsforcollab.forEach(h => {
                                if (self.actuallyjoinedheros.includes(h.getKind())) {
                                    h.incrementHour()
                                }
                            })

                            var totalattack = self.yourattack + alliedattacksum
                            console.log('totalatk:', totalattack, 'uratk:', self.yourattack, 'result', result)
                            if (totalattack > result) {
                                //hero(s) win.
                                //todo handle reinvite (i think done?)
                                self.gameinstance.doDamageToMonster(self.monstername, totalattack - result)
                                self.notificationtext.setText('WHAM!! You hit them for \n' + (totalattack - result) + ' damage!')
                                self.tween()
                                self.monsterwill = self.monsterwill - (totalattack - result)
                                self.monsterwilltxt.setText('Will: ' + self.monsterwill)
                                if (self.monsterwill < 1) {
                                    self.victory()
                                }
                            }
                            else if (totalattack < result) {
                                //monster win.
                                //WARNING: here im doing some client side calculations on heros will to determine if they die.
                                // I think this is wrong and will have to be changed, as those values are only up to date if
                                // youve opened their hero panel recently. TODO.

                                //do damage to all involved heros, backend
                                self.gameinstance.doDamageToHero(self.hero.getKind(), result - totalattack)
                                for (let ally of self.actuallyjoinedheros) {
                                    self.gameinstance.doDamageToHero(ally, result - totalattack)
                                }

                                // determine which allies died and remove them from possible allies and display death on their screen
                                // (this is the bad client side calculation that I need to change eventually)
                                // this is the one shaky part of the code basically.
                                self.heroobjectsforcollab.forEach(hero => {
                                    if (self.actuallyjoinedheros.includes(hero.getKind())) {
                                        hero.setwillPower(-(result - totalattack))
                                        if (hero.getWillPower() < 1) {
                                            var index = self.alliedheros.indexOf(hero.getKind());
                                            if (index > -1) {
                                                self.alliedheros.splice(index, 1);
                                                console.log('removed', hero.getKind(), 'due to death.')
                                                //send message to display death on their screen.
                                                self.gameinstance.sendDeathNotice(hero.getKind())
                                            }
                                        }
                                    }
                                });
                                
                                self.hero.setwillPower(-(result - totalattack))
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
                                //TODO tie (anything else to do?)
                                self.notificationtext.setText('Tie! You are \nevenly matched...')
                            }
                        }
                        else {
                            console.log(alliedrollstxtreceived, self.actuallyjoinedheros.length, self.inviteresponses, self.alliedheros.length)
                            this.setText('Not all allied heroes\nhave confirmed their roll.\n Click again.')
                        }
                    })

                }

                else {
                    console.log('case3')
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
        this.exitbutton.on('pointerdown', function (pointer) {
            self.scene.resume("Game")
            self.scene.remove(self.windowname)
        })
    }


    private displayInvList() {
        var self = this
        //display possible players to invite to the game.
        this.invitetext = this.add.text(250, 50, 'Allies in range:')
        if (self.alliedheros.length > 0) {
            //iterate over other heros in range.
            for (let i = 0; i < self.alliedheros.length; i++) {
                //display them in the window.
                this.invitetext.setText(this.invitetext.getWrappedText() + '\n' + self.alliedheros[i])
            }
            this.sendInvites()
        }
        else {
            this.invitetext.setText('No other \nplayers in\nrange.')
        }
    }

    private sendInvites() {
        var self = this
        //this will display a invite request pop-up on the clients of all heroes in range.
        self.gameinstance.sendBattleInvite(self.monster.tile.id, self.alliedheros)
        self.gameinstance.receiveBattleInviteResponse(function (response, herokind) {
            self.inviteresponses++
            if (response == 'yes') {
                console.log('yes ' + herokind)
                self.actuallyjoinedheros.push(herokind)
            }
        })
    }

    private doHelm(alldice, str) {
        var self = this
        //hero is either warrior or dwarf: display option to use helmet.
        //we don't display it for other classes because its useless: they roll 1 die
        self.otherdicetext = self.add.text(240,150,'All your dice: ')
        self.helmtext = self.add.text(240,165,'Click to use helm.').setInteractive()
        for (let die of alldice) {
            self.otherdicetext.setText(self.otherdicetext.getWrappedText() + ' ' + die)
        }
        self.helmtext.on('pointerdown', function(pointer) {
            //TODO: delete the helmet on client and server side.
            self.gameinstance.consumeItem('helm')
            self.helmtext.disableInteractive()
            self.otherdicetext.destroy()
            self.helmtext.destroy()
            var newroll = 0
            for (var i = 0; i < alldice.length; i++) {
                newroll += alldice[i];
            }
            let attack = newroll + str
            self.yourattack = attack
            self.yourroll.setText('Your roll: ' + newroll + 'Your str: ' + str) 
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
        this.destroyTexts(true)

        let vic = this.add.text(70, 20, "VICTORY!")
        this.tweens.add({
            targets: vic,
            alpha: 0.3,
            duration: 220,
            ease: 'Power3',
            yoyo: true
        });

        var goldtext = this.add.text(70, 50, "Click to loot " + this.monstergold + " gold.").setInteractive()
        var willtext = this.add.text(70, 80, "Click to plunder " + this.monstergold + "  willpower.").setInteractive()

        var involvedheros = []
        //unfortunately we have to do this because collab window wants actual hero onjcts instad of their kind as a string
        //even thought all it needs them for is the getKind()...
        self.heroobjectsforcollab.forEach(element => {
            if (element.getKind() == self.hero.getKind() || self.actuallyjoinedheros.includes(element.getKind())) {
                involvedheros.push(element)
            }
        });

        goldtext.on('pointerdown', function (pointer) {
            self.gameinstance.sendCollabApproveToBattleAllies(self.monstername + 'collab')
            var res = new Map([
                ["gold", self.monstergold]
            ])

            var width = (res.size + 1) * collabColWidth;
            var height = (3) * collabRowHeight;

            var collabwindowdata = {
                controller: self.gameinstance,
                isOwner: true,
                heroes: involvedheros,
                resources: res,
                textOptions: null,
                x: reducedWidth / 2 - width / 2,
                y: reducedHeight / 2 - height / 2,
                w: width,
                h: (involvedheros.length + 2) * collabRowHeight,
                infight: true
            }

            WindowManager.create(this, self.monstername + 'collab', CollabWindow, collabwindowdata)
            self.scene.remove(self.monstername)
        }, this)


        willtext.on('pointerdown', function (pointer) {
            self.gameinstance.sendCollabApproveToBattleAllies(self.monstername + 'collab')
            var res = new Map([
                ["will", self.monstergold]
            ])

            var width = (res.size + 1) * collabColWidth;
            var height = (3) * collabRowHeight;

            var collabwindowdata = {
                controller: self.gameinstance,
                isOwner: true,
                heroes: involvedheros,
                resources: res,
                textOptions: null,
                x: reducedWidth / 2 - width / 2,
                y: reducedHeight / 2 - height / 2,
                w: width,
                h: (involvedheros.length + 2) * collabRowHeight,
                infight: true
            }

            WindowManager.create(this, self.monstername + 'collab', CollabWindow, collabwindowdata)
            self.scene.remove(self.monstername)
        }, this)

        //deleting the monster.
        this.gameinstance.killMonster(self.monstername)
    }


    public death() {
        //if you died, end your turn and reset the stats.
        var self = this
        this.destroyTexts(false)
        this.add.text(70, 50, "You lost and lose\n 1 strength. Your turn \n is over. Your \nwill is set to 3.")
        var text = this.add.text(70, 150, "Click to accept.").setInteractive()
        text.on('pointerdown', function (pointer) {
            self.scene.remove(self.windowname)
            if (self.gameinstance.getTurn()) {
                self.gameinstance.endTurn();
            }
        })
    }

    private destroyTexts(victory) {
        if (victory) {
            this.monster.destroy()
        }
        this.alliedrollstxt.destroy()
        this.invitetext.destroy()
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
    }

}