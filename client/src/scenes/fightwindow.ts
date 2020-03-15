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

    public constructor(key, data, windowData = { x: 10, y: 10, width: 450, height: 350 }) {
        super(key, windowData);
        console.log(data)
        this.windowname = key
        this.gameinstance = data.controller
        this.monstertexture = data.monster.texture
        this.monstername = data.monster.name
        this.hero = data.hero
        this.monster = data.monster
        var self = this
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
        this.notificationtext = this.add.text(90,170, '', { backgroundColor: '#3b44af' })
        this.fighttext = this.add.text(90, 25, 'Fight!!', { backgroundColor: '#363956' }).setInteractive()
        this.theirroll = this.add.text(90, 75, 'Their roll: ', { backgroundColor: 'fx00' })
        this.yourroll = this.add.text(90, 125, 'Your roll: ', { backgroundColor: 'fx00' })

        //click the fight text to fight.
        this.fighttext.on('pointerdown', function (pointer) {
            console.log('fighting!!')
            self.gameinstance.rollMonsterDice(self.monstername, function (monsterroll, heroroll, winner) {
                if (monsterroll == 'outofrange'){
                    self.notificationtext.setText('Out of range!!!!!!')
                }
                else if (monsterroll == 'notime'){
                    self.notificationtext.setText('Get some sleep!!!!')
                }
                else if (winner == 'monster'){
                    self.hero.incrementHour()
                    self.theirroll.setText('Their attack: '  + monsterroll)
                    self.yourroll.setText('Your attack: '  + heroroll)
                    self.notificationtext.setText('OUCH!! You take \n' + (monsterroll - heroroll) + ' damage!')
                    self.tweentext()
                }
                else if (winner == 'hero') {
                    self.hero.incrementHour()
                    self.theirroll.setText('Their attack: '  + monsterroll)
                    self.yourroll.setText('Your attack: '  + heroroll)
                    self.notificationtext.setText('WHAM!! You hit them for \n' + (heroroll - monsterroll) + ' damage!')
                    self.tween()
                    self.monsterwill = self.monsterwill - (heroroll - monsterroll)
                    self.monsterwilltxt.setText('Will: ' + self.monsterwill)
                    if (self.monsterwill < 5) {
                        self.victory()
                    }
                }
                else {
                    //tie
                    self.hero.incrementHour()
                    self.theirroll.setText('Their attack: '  + monsterroll)
                    self.yourroll.setText('Your attack: '  + heroroll)
                    self.notificationtext.setText('Tie! You are \nevenly matched...')
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

        var invitetext = this.add.text(250,50, 'Invite to fight').setInteractive()
        invitetext.on('pointerdown', function(pointer) {
            if (self.alliedheros.length > 0) {
                for (let i = 0; i < self.alliedheros.length; i++) {
                    let invhero = self.add.text(250, 65, self.alliedheros[i])
                    invhero.on('pointerdown', function(pointer) {
                        //self.gameinstance.sendBattleInvite(self.alliedheros[i])
                        
                    })
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

}