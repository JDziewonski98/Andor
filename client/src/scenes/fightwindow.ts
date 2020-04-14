import { Window } from "./window";
import { game } from "../api/game";
import { WindowManager } from "../utils/WindowManager";
import { CollabWindow } from "./collabwindow"
import {
    reducedWidth, reducedHeight, collabColWidth, collabRowHeight
} from '../constants'
import BoardOverlay from "./boardoverlay";

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
    private princeText;
    //for helm
    private otherdicetext;
    private helmtext;
    //for brew
    private brewtext;
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
    private princePos;
    private princebonus: number = 0;
    private shieldresponsesexpected = 0
    private shieldresponsecnt = 0
    private shieldinteractivecheckcnt = 0
    // To toggle interactivity of overlay
    private overlayRef: BoardOverlay;

    public constructor(key, data, windowData = { x: 10, y: 10, width: 500, height: 380 }) {
        super(key, windowData);
        this.windowname = key
        this.gameinstance = data.controller
        this.monstertexture = data.monster.texture
        this.monstername = data.monster.name
        this.hero = data.hero
        this.monster = data.monster
        this.princePos = data.princePos
        this.overlayRef = data.overlayRef;
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
        // this.monstericon = this.add.image(40, 40, this.monstertexture)
        console.log(this.monstername)
        if (this.monstername == "fortress") {
            console.log("sanity")
            this.monstericon = this.add.image(40, 60, this.monstertexture).setScale(0.6)
        } else {
            this.monstericon = this.add.image(40, 40, this.monstertexture)
        }

        // disable the overlay
        this.overlayRef.toggleInteractive(false);

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
        this.princeText = this.add.text(90, 300, '')
        console.log('princepos:',this.princePos, this.monster.tile.id)
        if (this.princePos == this.monster.tile.id) {
            this.princeText.setText('Prince: +4 dmg')
            this.princebonus = 4;
        }

        //click the fight text to enter the fight.
        this.fighttext.on('pointerdown', function (pointer) {
            self.inviteresponses = 0
            var haveyourolled = false
            self.alliedrollstxt.setText('Allied rolls: ')
            self.actuallyjoinedheros = []
            self.fighttext.setText('Fight again!')

            //the monster roll dice determines if you are actually in range to fight it and if you need to use bow.
            self.gameinstance.rollMonsterDice(self.monstername, function (result, bow) {

                if (self.gameinstance.getTurn() == false) {
                    self.notificationtext.setText('Not your Turn!')
                }

                else if (result != 'outofrange') {
                    self.fighttext.disableInteractive()

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
                            var alldice = data.alldice

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
                                    if (count >= data.rolls.length - 1) {
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
                                    //TODO: handle black die faces
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

                                //this else means we are dwarf or warrior using standard attack.
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
                            //handle brew here:
                            self.gameinstance.getHeroItems(self.hero.getKind(), function(itemdict) {
                                if (itemdict['smallItems'].includes('half_brew') || itemdict['smallItems'].includes('brew')) {
                                    self.brewtext = self.add.text(260,190,'Click to use\n witch\'s brew.').setInteractive();
                                    self.brewtext.on('pointerdown', function(pointer) {
                                        var cur_roll = self.yourattack - data.strength
                                        var doubled_roll = cur_roll * 2
                                        self.yourroll.setText('Your roll: ' + doubled_roll + 'Your str: ' + data.strength)
                                        self.yourattack = doubled_roll + data.strength
                                        self.brewtext.destroy()
                                        try {
                                            self.helmtext.destroy()
                                            self.otherdicetext.destroy()
                                        }
                                        catch {
                                            //its fine
                                        }
                                        //prioritize consuming a half_brew
                                        if (itemdict['smallItems'].includes('half_brew')) {
                                            self.gameinstance.consumeItem('half_brew')
                                        }
                                        else {
                                            self.gameinstance.consumeItem('brew')
                                        }
                                    })

                                }
                            })
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
                            self.gameinstance.unsubscribeAlliedRollListener()
                            self.gameinstance.unsubscribeShieldListeners()
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
                            self.gameinstance.updateHourTracker(self.hero.getKind())

                            var totalattack = self.yourattack + alliedattacksum
                            console.log('totalatk:', totalattack, 'uratk:', self.yourattack, 'result', result)
                            if (totalattack + self.princebonus > result) {
                                //hero(s) win.
                                //todo handle reinvite (i think done?)
                                self.gameinstance.doDamageToMonster(self.monstername, totalattack + self.princebonus - result)
                                self.notificationtext.setText('WHAM!! You hit them for \n' + (totalattack + self.princebonus - result) + ' damage!')
                                self.tween()
                                self.monsterwill = self.monsterwill - (totalattack + self.princebonus - result)
                                self.monsterwilltxt.setText('Will: ' + self.monsterwill)
                                if (self.monsterwill < 1) {
                                    self.victory()
                                }
                                self.fighttext.setInteractive();
                            }
                            else if (totalattack + self.princebonus < result) {
                                //monster win.
                                //WARNING: here im doing some client side calculations on heros will to determine if they die.
                                // I think this is wrong and will have to be changed, as those values are only up to date if
                                // youve opened their hero panel recently. TODO.

                                //do damage to all involved heros, backend
                                self.gameinstance.getHeroItems(self.hero.getKind(), function(itemdict) {
                                    if (itemdict['largeItem'] == 'shield') {
                                        //self.fighttext.disableInteractive()
                                        self.gameinstance.sendShieldPrompt(self.hero.getKind(), false, result - totalattack - self.princebonus, true)
                                    }
                                    else if (itemdict['largeItem'] == 'damaged_shield') {
                                        //self.fighttext.disableInteractive()
                                        self.gameinstance.sendShieldPrompt(self.hero.getKind(), true, result - totalattack - self.princebonus, true)
                                    }
                                    else {
                                        console.log('here 328 xxxxxx')
                                        self.gameinstance.doDamageToHero(self.hero.getKind(), result - totalattack - self.princebonus, function() {
                                            console.log('here 336 xxxxxxxxxxxxxxxxxxxxx')
                                            self.hero.resetWillPower()
                                            self.hero.setStrength(-1)
                                            self.death()
                                        })
                                        self.gameinstance.getHeroAttributes(self.hero.getKind(), function(data) {
                                            try{
                                                self.yourwill = data.will
                                                self.yourwilltxt.setText('Your will: ' + self.yourwill)
                                                self.notificationtext.setText('OUCH!! You take \n' + (result - totalattack - self.princebonus) + ' damage!')
                                                self.tweentext()
                                            }
                                            catch {
                                                console.log('its fine, you just died.')
                                            }
                                        })
                                    }
                                })
                                console.log('actuallyjoinedzzzzzzzzzz', self.actuallyjoinedheros)
                                for (let ally of self.actuallyjoinedheros) {
                                    console.log('349999999999999999999999', ally)
                                    self.gameinstance.getHeroItems(ally, function(itemdict) {
                                        console.log('351111111111111111111111111111', ally, itemdict)
                                        if (itemdict['largeItem'] == 'shield') {
                                            self.fighttext.disableInteractive()
                                            self.shieldresponsesexpected++
                                            self.gameinstance.sendShieldPrompt(ally, false, result - totalattack - self.princebonus, false)
                                        }
                                        else if (itemdict['largeItem'] == 'damaged_shield'){
                                            self.fighttext.disableInteractive()
                                            self.shieldresponsesexpected++
                                            self.gameinstance.sendShieldPrompt(ally, true, result - totalattack - self.princebonus, false)

                                        }
                                        else {
                                            self.shieldinteractivecheckcnt++
                                            console.log('bruhhhhhhhhhhhh', self.shieldinteractivecheckcnt, self.actuallyjoinedheros.length)
                                            if (self.shieldinteractivecheckcnt == self.actuallyjoinedheros.length) {
                                                console.log('here. not gD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                                                self.shieldinteractivecheckcnt = 0;
                                                self.fighttext.setInteractive()
                                            }
                                            self.gameinstance.doDamageToHero(ally, result - totalattack - self.princebonus)
                                            self.gameinstance.getHeroAttributes(ally, function(data) {
                                                if (data.will < 1){
                                                    var index = self.alliedheros.indexOf(ally);
                                                    if (index > -1) {
                                                        self.alliedheros.splice(index, 1);
                                                        console.log('removed', ally, 'due to death.')
                                                        //send message to display death on their screen.
                                                        self.gameinstance.sendDeathNotice(ally)
                                                    } 
                                                }
                                            })
                                        }
                                    })
                                }
                                if (self.actuallyjoinedheros.length == 0){
                                    console.log('not gdasda!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
                                    self.fighttext.setInteractive();
                                }
                                /*
                                *todo:
                                *set a listener for responses from the shield 
                                *if its a yes response, just increment response cnt
                                *if its a no reponse, increment response cnt, and check for death using get attributes.
                                *if theyre dead, remove them from allied heroes, and send them a death reponse
                                *once u get enough reponses, enable fight text interactive and reset both counts to 0
                                *remember to unsubscribe this listener upon close of the window
                                * */
                               self.gameinstance.receiveShieldResp(function(herotype, resp){
                                   console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ')
                                   self.shieldresponsecnt++
                                   if (resp == 'no') {
                                       //check for death
                                       self.gameinstance.getHeroAttributes(herotype, function(data){
                                           if (data.will - (result - self.princebonus - totalattack) < 1){
                                               //remove hero from alliedherolist
                                               var index = self.alliedheros.indexOf(herotype);
                                               if (index > -1) {
                                                   self.alliedheros.splice(index, 1);
                                                   console.log('removed', herotype, 'due to death.')
                                               }
                                               self.gameinstance.sendDeathNotice(herotype)
                                           }
                                           self.gameinstance.doDamageToHero(herotype, result - self.princebonus - totalattack)
                                       })
                                   }
                                   if (self.shieldresponsecnt == self.shieldresponsesexpected) {
                                       console.log(self.shieldresponsecnt, self.shieldresponsesexpected, 'herexxxxxxxx')
                                       self.shieldresponsesexpected = 0;
                                       self.shieldresponsecnt = 0;
                                       self.shieldinteractivecheckcnt = 0;
                                       try{
                                        self.fighttext.setInteractive()
                                       }
                                       catch {
                                           console.log('we good')
                                       }
                                   }
                               })
                            }

                            else {
                                //TODO tie (anything else to do?)
                                self.notificationtext.setText('Tie! You are \nevenly matched...')
                                self.fighttext.setInteractive()
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
            self.gameinstance.resetMonsterStats(self.monstername)
            self.overlayRef.toggleInteractive(true);
            self.scene.resume("Game")
            self.scene.remove(self.windowname)
            self.gameinstance.endTurn()
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
            try {
                self.brewtext.disableInteractive()
                self.brewtext.setText('')
            }
            catch {}
            self.gameinstance.consumeItem('helm')
            self.helmtext.disableInteractive()
            self.otherdicetext.destroy()
            self.helmtext.destroy()
            var newroll = 0
            var used = []
            for (var i = 0; i < alldice.length; i++) {
                var count = 0
                for (var j = 0; j< alldice.length; j++) {
                    if (alldice[i] == alldice[j]) {
                        count++
                    }
                }
                if (count > 1 && !used.includes(alldice[i])) {
                    newroll += count * alldice[i]
                    used.push(alldice[i])
                }
            }
            let attack = newroll + str
            self.yourattack = attack
            self.yourroll.setText('Your roll: ' + newroll + 'Your str: ' + str) 
        })
    }

    public tween() {
        //  Flash the mosntericon
        this.monstericon.setTint('#000000')
        this.tweens.add({
            targets: this.monstericon,
            alpha: 0.2,
            duration: 160,
            ease: 'Power3',
            yoyo: true
        });
        this.monstericon.clearTint()
    }


    public tweentext() {
        this.tweens.add({
            targets: this.notificationtext,
            alpha: 0.2,
            duration: 160,
            ease: 'Power3',
            yoyo: true
        });
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
                infight: true,
                overlayRef: self.overlayRef
            }

            WindowManager.create(this, self.monstername + 'collab', CollabWindow, collabwindowdata)
            //TODO should move narrator
            self.gameinstance.endTurn()
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
                infight: true,
                overlayRef: self.overlayRef
            }

            WindowManager.create(this, self.monstername + 'collab', CollabWindow, collabwindowdata)
            //TODO should move narrator
            self.gameinstance.endTurn()
            self.scene.remove(self.monstername)
        }, this)

        //deleting the monster.
        this.gameinstance.killMonster(self.monstername)
    }

    public death() {
        //if you died, end your turn and reset the stats.
        console.log('doing death')
        var self = this
        this.destroyTexts(false)
        this.add.text(70, 50, "You lost and lose\n 1 strength. Your turn \n is over. Your \nwill is set to 3.")
        var text = this.add.text(70, 150, "Click to accept.").setInteractive()
        text.on('pointerdown', function (pointer) {
            self.overlayRef.toggleInteractive(true);
            self.scene.resume("Game");
            self.scene.remove(self.windowname);
            if (self.gameinstance.getTurn()) {
                self.gameinstance.endTurn();
            }
        })
    }

    private destroyTexts(victory) {
        if (victory) {
            this.monster.destroy()
        }
        this.princeText.destroy()
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