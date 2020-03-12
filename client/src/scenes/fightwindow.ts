import { Window } from "./window";
import { game } from "../api/game";

export class Fight extends Window {
    private gameinstance: game;
    private monstertexture;
    private herostr;
    private herowill;
    private fighttext;
    private monstername;
    private theirroll;

    public constructor(key, data, windowData = { x: 10, y: 10, width: 350, height: 250 }) {
        super(key, windowData);
        console.log(data)
        this.gameinstance = data.controller
        this.monstertexture = data.monstertexture
        this.monstername = data.monstername
        this.herostr = data.hero.getStrength()
        this.herowill = data.hero.getWillPower()
    }

    protected initialize() {
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        bg.tint = 0xff0000
        var monstericon = this.add.image(30,30,this.monstertexture)
        this.fighttext = this.add.text(50, 100, 'Fight!!', { backgroundColor: 'fx00' }).setInteractive()
        this.theirroll = this.add.text(50, 200, 'Their roll: ', { backgroundColor: 'fx00' })
        this.fighttext.on('pointerdown', function (pointer) {
            console.log('fighting!!')
            self.gameinstance.rollMonsterDice(self.monstername, function (roll) {
                self.theirroll.setText('Their roll: '  + roll)
            })
        })
    }



}