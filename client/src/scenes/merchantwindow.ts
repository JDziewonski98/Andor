import { Window } from "./window";
import { game } from '../api/game';
import { WindowManager } from "../utils/WindowManager";
export class MerchantWindow extends Window {

    private yes;
    private no;
    private key;
    private gameinstance: game;

    public constructor(key: string, gameinstance: game, windowData = { x: 350, y: 30, width: 450, height: 150 }) {
        super(key, windowData);
        this.gameinstance = gameinstance
        this.key = key;
    }

    protected initialize() {

        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        this.add.text(10, 50, 'So lookin\' to acquire some strength, eh?', { backgroundColor: 'fx00' })
        this.yes = this.add.text(50, 120, 'Yes', { backgroundColor: 'fx00' })
        this.no = this.add.text(100, 120, 'No', { backgroundColor: 'fx00'  })
    
        bg.setInteractive()
        
        this.yes.setInteractive()
        this.no.setInteractive();

        var self = this
        this.yes.on('pointerdown', function (pointer) {
            self.gameinstance.merchant(function(){
                WindowManager.destroy(self, self.key);
            });

        }, this);

        this.no.on('pointerdown', function (pointer) {
            WindowManager.destroy(self, self.key);
        }, this);
    }

    /*public setGold(amt: number) {
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
    }*/
}