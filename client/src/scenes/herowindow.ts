import { Window } from "./window";
import { game } from '../api/game';
export class HeroWindow extends Window {

    public icon
    public gold: number
    public will: number
    public str: number
    public farmers: number
    private goldtext
    private willtext
    private nametext
    private strtext
    private farmtext
    private name
    private gameinstance: game;

    public constructor(key: string, data, windowData = { x: 350, y: 30, width: 400, height: 250 }) {
        super(key, windowData);
        this.icon = data.icon
        this.name = data.name
        this.gameinstance = data.controller
        this.gold = data.gold
        this.will = data.will
        this.str = data.strength
        this.farmers = data.farmers

    }

    protected initialize() {

        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        var weed = this.add.sprite(50, 50, this.icon);
        this.goldtext = this.add.text(25, 100, 'Gold: ' + this.gold, { backgroundColor: 'fx00' })
        this.willtext = this.add.text(25, 120, 'Willpower: ' + this.will, { backgroundColor: 'fx00' })
        this.strtext = this.add.text(25, 140, 'Strength: ' + this.str, { backgroundColor: 'fx00' })
        this.farmtext = this.add.text(25, 160, 'Farmers: ' + this.farmers, { backgroundColor: 'fx00' })
        this.add.text(25, 180, 'Items ....', { backgroundColor: 'fx00' })
        this.add.text(25, 200, 'Special ability text ....', { backgroundColor: 'fx00' })

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
        this.goldtext.on('pointerdown', function () {            
            console.log("we droppin the gold")
            console.log(that.gold)
            if (that.gold > 0 ) {
                that.gold -= 1
                that.refreshText()
                console.log(that.gold)
                that.gameinstance.dropGold(function () {
                    //create a token on the tile 
                    //indicate the amount of gold on tile

                })
            }           
        });


        this.gameinstance.updateDropGold(function () {
            console.log("here4")// is printed
            that.gold -= 1
            that.refreshText()
            //same code as above to show gold being dropped
        })



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
        console.log(this.name)

    }
}