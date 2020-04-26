import { game } from '../api/game';
import { Window } from "./window";
import {WindowManager} from "../utils/WindowManager";

export class CoastalMerchantWindow extends Window {
    private gameController: game;
    private buyStrengthButton: Phaser.GameObjects.Text;
    private gameScene
    public constructor(key: string, data) {
        super(key, { x: data.x, y: data.y, width: data.w, height: data.h });
        this.gameController = data.controller;
        this.gameScene = data.gameScene
    }

    protected initialize() { 
        console.log('initializing tempmerchant window')
        this.add.image(0, 0, 'scrollbg');
        this.add.text(5, 5, `The trade ships\o offer strength:`, { fontSize: 12, backgroundColor: '#f00' });

        var self = this;

        // Strength icon
        this.add.image(5, 35, 'Strength').setDisplaySize(30, 30).setOrigin(0);
        self.buyStrengthButton = self.add.text(5, 90, "Buy", { fontSize: 12, backgroundColor: '#f00' });
        self.buyStrengthButton.setInteractive();
        self.buyStrengthButton.on("pointerdown", function(pointer) {
            self.gameController.buyFromCoastalTrader();
            WindowManager.destroy(self, "temp_merchant");
        }, this)
    }

    
}
