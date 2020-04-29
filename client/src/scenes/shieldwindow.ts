import { Window } from "./window";

export class ShieldWindow extends Window {
    private gameinstance
    private windowname
    private potentialdamage:number = 0;
    private hero;
    private damaged:boolean

    public constructor(key: string, data, windowData = { x: 350, y: 30, width: 400, height: 250 }) {
        super(key, windowData);
        this.gameinstance = data.controller
        this.windowname = key
        this.potentialdamage = data.potentialdamage
        this.hero = data.hero;
        this.damaged = data.damaged
    }

    protected initialize() {
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        bg.tint = 0xff0000
        this.add.text(25,25,'You are about to take '+this.potentialdamage+' damage.\nUse shield to prevent?')
        var yesbutton = this.add.text(100,200, 'Yes').setInteractive({useHandCursor: true})
        var nobutton = this.add.text(150,200, 'No').setInteractive({useHandCursor: true})
        yesbutton.on('pointerdown', function(pointer) {
            if (self.damaged) {
                self.gameinstance.consumeItem('damaged_shield')
            }
            else {
                self.gameinstance.consumeItem('shield')
            }
            self.gameinstance.sendShieldResp(self.hero.getKind(),'yes');
            self.scene.remove(self.windowname)

        })
        nobutton.on('pointerdown', function(pointer) {
            //self.gameinstance.doDamageToHero(self.hero.getKind(), self.potentialdamage)
            self.gameinstance.sendShieldResp(self.hero.getKind(),'no');
            self.scene.remove(self.windowname)
        })
    }

}