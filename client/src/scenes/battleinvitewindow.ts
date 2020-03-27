import { Window } from "./window";
import { game } from '../api/game';
import { WindowManager } from "../utils/WindowManager";
import { CollabWindow } from './collabwindow';

export class BattleInvWindow extends Window {

    private gameinstance: game;
    private windowname
    private herokind
    private rolltext;
    private abilitytext;
    private abilitybutton;
    private confirmbutton;
    //for helm
    private helmtext
    private otherdicetext

    private roll = -1;
    private str = -1;
    private hero
    private gamescene

    public constructor(key: string, data, windowData = { x: 350, y: 30, width: 400, height: 250 }) {
        super(key, windowData);
        this.gameinstance = data.controller
        this.windowname = key
        this.herokind = data.hero.getKind()
        this.hero = data.hero
        this.gamescene = data.gamescene
    }

    protected initialize() {
        console.log('in init')
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        bg.tint = 0xff0000

        var headertext = this.add.text(50,10,'Do you want to join the battle?')
        var yesbutton = this.add.text(50,25,'YES').setInteractive()
        var nobutton = this.add.text(50,40,'NO').setInteractive()
        var self = this

        yesbutton.on('pointerdown', function(pointer) {
            self.hero.incrementHour()
            self.gameinstance.sendBattleInviteResponse('yes', self.herokind)
            yesbutton.destroy()
            nobutton.destroy()
            headertext.setText('In battle.')
            self.rolltext = self.add.text(50, 25, 'Your roll: ' + self.roll + ' Your str: ' + self.str)

            self.gameinstance.heroRoll(false, function(data) {
                self.hero.incrementHour()
                self.str = data.strength
                var alldice = data.alldice
                if (self.herokind == 'archer') {
                    var count = 0
                    self.roll = data.rolls[count]
                    if (count > data.rolls.length - 1) {
                        self.abilitytext = self.add.text(50,40,'You may reroll ' + (data.rolls.length-1-count) + ' more times.')
                        self.rolltext.setText('Your roll: ' + self.roll + ' Your str: ' + self.str)
                        self.abilitybutton = self.add.text(50,55,'Click to use ability.').setInteractive()
                    }
                    self.abilitybutton.on('pointerdown', function(pointer) {
                        count++
                        self.abilitytext.setText('You may reroll ' + (data.rolls.length-1-count) + ' more times.')
                        self.roll = data.rolls[count]
                        self.rolltext.setText('Your roll: ' + self.roll + ' Your str: ' + self.str)
                        if (count <= data.rolls.length - 1) {
                            self.abilitybutton.disableInteractive()
                            self.abilitybutton.destroy()
                        }
                    })                 
                }
                else {
                    //handle non archer heros
                    self.rolltext.setText('Your roll: ' + data.roll + 'Your str:' + data.strength)
                    self.roll = data.roll
                    //handle mage ability
                    if (self.hero.getKind() == 'mage') {
                        self.abilitytext = self.add.text(50,40,'You may flip the die to: ' + (7-data.roll))
                        var oppositeside = 7 - data.roll
                        self.abilitybutton = self.add.text(50,55,'Click to use ability.').setInteractive()
                        self.abilitybutton.on('pointerdown', function(pointer){
                            self.abilitytext.setText('Mage ability used.')
                            self.abilitybutton.disableInteractive()
                            self.roll = oppositeside
                            self.rolltext.setText('Your roll: ' + oppositeside + 'Your str:' + data.strength)
                        })
                    }
                    else {
                        self.gameinstance.getHeroItems(self.hero.getKind(), function(itemdict) {
                            if (itemdict['helm'] == 'true') {
                                self.doHelm(alldice, self.str)
                            }
                            //TODO handle brew, herb, shield
                        })
                    }
                }
                
                self.confirmbutton = self.add.text(50,70,'Click to confirm your attack.').setInteractive()
                self.confirmbutton.on('pointerdown', function(pointer) {
                    //send the roll to battle host and destroy the window.
                    self.gameinstance.confirmroll(self.herokind, self.roll, self.str)
                    //maybe display results first?
                    self.gameinstance.unsubscribeBattleRewardsPopup()
                    self.gameinstance.battleRewardsPopup(function(windowname){
                        var collabWindowData = {
                            controller: self.gameinstance,
                            isOwner: false,
                            x: 250,
                            y: 250,
                            w: 200,
                            h: 100,
                            infight:false
                          }
                          WindowManager.create(self.gamescene, windowname, CollabWindow, collabWindowData);
                    })
                    self.scene.remove(self.windowname)
                })   
            })
        })

        nobutton.on('pointerdown', function(pointer) {
            self.gameinstance.sendBattleInviteResponse('no', self.herokind)
            self.scene.remove(self.windowname)
        })

    }

    private doHelm(alldice, str) {
        var self = this
        //hero is either warrior or dwarf: display option to use helmet.
        //we don't display it for other classes because its useless: they roll 1 die
        self.otherdicetext = self.add.text(200,150,'All your dice: ')
        self.helmtext = self.add.text(200,165,'Click to use helm.').setInteractive()
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
            self.rolltext.setText('Your roll: ' + newroll + 'Your str: ' + str) 
            self.roll = newroll
        })
    }

}