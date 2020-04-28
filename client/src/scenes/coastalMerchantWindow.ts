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
        this.add.text(5, 5, ` The trade ships\n offer 2 strength\n for 2 gold`, { fontSize: 12, backgroundColor: '#f00' });

        var self = this;

        // Strength icons
        this.add.image(5, 55, 'Strength').setDisplaySize(40, 40).setOrigin(0);
        this.add.image(45, 55, 'Strength').setDisplaySize(40, 40).setOrigin(0);
        self.buyStrengthButton = self.add.text(35, 120, "Buy", { fontSize: 12, backgroundColor: '#f00' });
        self.buyStrengthButton.setInteractive();
        self.buyStrengthButton.on("pointerdown", function(pointer) {
            self.gameController.buyFromCoastalTrader();
            WindowManager.destroy(self, "temp_merchant");
        }, this)
    }

    
}
