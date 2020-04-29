import { game } from '../api/game';
import { Window } from "./window";

export class WitchWindow extends Window {
    private gameController: game;
    private buyBrewButton: Phaser.GameObjects.Text;

    public constructor(key: string, data) {
        super(key, { x: data.x, y: data.y, width: data.w, height: data.h });
        this.gameController = data.controller;
    }

    protected initialize() { 
        this.add.image(0, 0, 'scrollbg');
        this.add.text(5, 5, `The witch sells\nher magic brew:`, { fontSize: 10, backgroundColor: '#f00' });

        var self = this;

        // Brew icon
        this.add.image(5, 35, 'brew').setDisplaySize(30, 30).setOrigin(0);
        // Get the tile's gold amount from server
        this.gameController.getNumBrews(function(numBrews: number) {
            self.buyBrewButton = self.add.text(33, 33, ""+numBrews, { fontSize: 10, backgroundColor: '#f00' });
            self.buyBrewButton.setInteractive({useHandCursor: true})
            self.buyBrewButton.on("pointerdown", function(pointer) {
                self.gameController.purchaseBrew();
            }, this)
        });

        // While window is active, listen for updates to the number of brews and
        // update the GUI of the window accordingly.
        this.gameController.updateNumBrews(function(newNumBrews) {
            if (newNumBrews) {
                self.buyBrewButton.setText(""+newNumBrews);
            }
        });
    }

    public disconnectListeners() {
        this.gameController.disconnectUpdateNumBrews();
    }
}
