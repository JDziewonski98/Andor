import { Window } from "./window";
import { game } from '../api/game';
export class HeroWindow extends Window {

    public icon
    public gold: number
    public will: number
    public str: number
    private goldtext
    private willtext
    private nametext
    private name
    private gameinstance: game;

    public constructor(key: string, gameinstance: game, data, windowData = { x: 350, y: 30, width: 350, height: 150 }) {
        super(key, windowData);
        this.icon = data.icon
        this.name = data.name
        this.gameinstance = gameinstance

        this.gold = 5
        this.will = 5
        this.str = 5

    }

    protected initialize() {

        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        var weed = this.add.sprite(50, 50, this.icon);
        this.goldtext = this.add.text(50, 100, 'Gold: ' + this.gold, { backgroundColor: 'fx00' })
        this.willtext = this.add.text(50, 120, 'Willpower: ' + this.will, { backgroundColor: 'fx00' })
        this.nametext = this.add.text(30, 10, "", { color: '#2c03fc' })
        this.add.text(150, 50, 'Special ability text ....', { backgroundColor: 'fx00' })
        this.add.text(150, 70, 'Items ....', { backgroundColor: 'fx00' })
        bg.setInteractive()
        this.input.setDraggable(bg)
        //This drag is pretty f'd up.
        bg.on('drag', function (pointer, dragX, dragY) {
            if (dragX < this.scene.parent.x - 10 && dragY < this.scene.parent.y - 10) {
                this.scene.parent.x = this.scene.parent.x - 10;
                this.scene.parent.y = this.scene.parent.y - 10;
                this.scene.refresh()
            }
            else {
                this.scene.parent.x = dragX;
                this.scene.parent.y = dragY;
                this.scene.refresh()
            }
        });
        this.goldtext.setInteractive()
        var that = this
        this.goldtext.on('pointerdown', function (pointer) {
            that.gameinstance.dropGold(1, function () {
                console.log("we droppin the gold")
            })

        });
    }

    public setGold(amt: number) {
        this.gold = amt
        this.refreshText()
    }

    public setStr(amt: number) {
        this.str = amt
        this.refreshText()
    }

    public setWill(amt: number) {
        this.will = amt
        this.refreshText()
    }

    public setName(name: string) {
        this.name = name
        this.refreshText()
    }

    private refreshText() {
        console.log('refeshing')
        this.goldtext.setText('Gold: ' + this.gold)
        this.willtext.setText('Willpower: ' + this.will)
        this.nametext.setText(this.name)
    }
}