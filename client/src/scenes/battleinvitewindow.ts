import { Window } from "./window";
import { game } from '../api/game';

export class BattleInvWindow extends Window {

    private gameinstance: game;
    private windowname
    private herokind
    private rolltext;
    private abilitytext;
    private abilitybutton;
    private confirmbutton;

    private roll = -1;
    private str = -1;

    public constructor(key: string, data, windowData = { x: 350, y: 30, width: 400, height: 250 }) {
        super(key, windowData);
        this.gameinstance = data.controller
        this.windowname = key
        this.herokind = data.heroname
    }

    protected initialize() {
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        bg.tint = 0xff0000

        var headertext = this.add.text(50,10,'Do you want to join the battle?')
        var yesbutton = this.add.text(50,25,'YES').setInteractive()
        var nobutton = this.add.text(50,40,'NO').setInteractive()
        var self = this

        yesbutton.on('pointerdown', function(pointer) {

            self.gameinstance.sendBattleInviteResponse('yes', self.herokind)
            yesbutton.destroy()
            nobutton.destroy()
            headertext.setText('In battle.')
            self.rolltext = self.add.text(50, 25, 'Your roll: ' + self.roll + ' Your str: ' + self.str)

            self.gameinstance.heroRoll(function(data) {
                if (self.herokind == 'archer') {
                    self.str = data.strength
                    var count = 0
                    self.roll = data.rolls[count]
                    self.abilitytext = self.add.text(50,40,'You may reroll ' + (data.rolls.length-1-count) + ' more times.')
                    self.rolltext.setText('Your roll: ' + self.roll + ' Your str: ' + self.str)
                    self.abilitybutton = self.add.text(50,55,'Click to use ability.').setInteractive()

                    self.abilitybutton.on('pointerdown', function(pointer) {
                        count++
                        self.abilitytext.setText('You may reroll ' + (data.rolls.length-1-count) + ' more times.')
                        self.roll = data.rolls[count]
                        self.rolltext.setText('Your roll: ' + self.roll + ' Your str: ' + self.str)
                        if (count == data.rolls.length - 1) {
                            self.abilitybutton.destroy()
                        }
                    })

                    self.confirmbutton = self.add.text(50,70,'Click to confirm your attack.').setInteractive()
                    self.confirmbutton.on('pointerdown', function(pointer) {
                        //send the roll to battle host and destroy the window.
                        self.gameinstance.confirmroll(self.herokind, self.roll, self.str)
                        //maybe display results first?
                        self.scene.remove(self.windowname)
                    })                    
                }
                else {
                    //todo: handle non archer heros
                }
            })
        })

        nobutton.on('pointerdown', function(pointer) {
            self.gameinstance.sendBattleInviteResponse('no', self.herokind)
            self.scene.remove(self.windowname)
        })

    }

}