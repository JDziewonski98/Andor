import { Window } from "./window";

export class ContinueFightWindow extends Window {
    private gameinstance
    private windowname
    private hero

    public constructor(key: string, data, windowData = { x: 350, y: 30, width: 400, height: 250 }) {
        super(key, windowData);
        this.gameinstance = data.controller
        this.windowname = key
        this.hero = data.hero
    }

    protected initialize() {
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        bg.tint = 0xff0000

        this.add.text(50,20,"Want to continue the fight as leader?")

        var yestext = this.add.text(50,50, 'yes').setInteractive()
        yestext.on('pointerdown', function(pointer) {
            self.gameinstance.sendContinueFight('yes', self.hero.getKind())
            self.scene.remove(self.windowname)
        })
        var notext = this.add.text(50,100, 'no').setInteractive()
        notext.on('pointerdown', function(pointer) {
            self.gameinstance.sendContinueFight('no', self.hero.getKind())
            self.scene.remove(self.windowname)
        })
    }

}