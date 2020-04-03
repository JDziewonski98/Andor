import { game } from '../api/game';
import { Window } from "./window";

export class TileWindow extends Window {
    private goldButton: Phaser.GameObjects.Text;
    private startX = 5;
    private xInc = 40;

    private gameController: game;
    private tileID: number;

    private goldQuantity: number;
    private itemQuantities = {};

    public constructor(key: string, data) {
        super(key, { x: data.x, y: data.y, width: data.w, height: data.h });
        this.gameController = data.controller;
        this.tileID = data.tileID;
    }

    protected initialize() { 
        this.add.image(0, 0, 'scrollbg').setOrigin(0.5);
        this.add.text(5, 5, `Region ${this.tileID} items:`, { fontSize: 10, backgroundColor: '#f00' });

        this.populateGold();
    }

    public populateGold() {
        var self = this;
        // Gold interaction (replaces addGold in GameScene)
        this.add.image(this.startX, 25, 'gold').setDisplaySize(30, 30).setOrigin(0);
        // Get the tile's gold amount from server
        this.gameController.getTileGold(this.tileID, function(goldAmount: number) {
            self.goldQuantity = goldAmount;
            self.goldButton = self.add.text(this.startX+28, 23, ""+self.goldQuantity, { fontSize: 10, backgroundColor: '#f00' });
            self.goldButton.setInteractive();
            self.goldButton.on("pointerdown", function(pointer) {
                self.gameController.pickupGold(self.tileID)
            }, this)
        });
        // While window is active, respond to updates in gold amount
        function updateGold(tileID: number, goldAmount: number) {
            if (tileID != self.tileID) return;
            self.goldQuantity = goldAmount;
            self.refreshGold();
        }
        this.gameController.updateDropGoldTile(updateGold);
        this.gameController.updatePickupGoldTile(updateGold);
    }

    public populateItems() {

    }

    public refreshGold() {
        this.goldButton.setText(""+this.goldQuantity);
    }

    public disconnectListeners() {
        //MUST be called before deleting the window, or else it will bug when opened subsequently!
        //turn off any socket.on(...) that u add here!
        this.gameController.disconnectUpdateDropGoldTile()
        this.gameController.disconnectUpdatePickupGoldTile()
    }
}
