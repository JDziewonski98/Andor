import { Tile } from '../objects';
import { game } from '../api/game';
import { Window } from "./window";

export class TileWindow extends Window {
    private goldButton;
    private startX = 5;
    private xInc = 40;

    private gameController: game;
    private tilesRef: Tile[];
    private tileID: number;

    public constructor(key: string, data) {
        super(key, { x: data.x, y: data.y, width: data.w, height: data.h });
        this.gameController = data.controller;
        this.tilesRef = data.tiles;
        this.tileID = data.tileID;
    }

    protected initialize() { 
        var self = this;
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5);
        this.add.text(5, 5, "Region items", { fontSize: 10, backgroundColor: '#f00' });
        this.add.image(5, 25, 'gold').setDisplaySize(30, 30).setOrigin(0);
        this.goldButton = this.add.text(33, 23, "1", { fontSize: 10, backgroundColor: '#f00' });
        this.goldButton.setInteractive();
        this.goldButton.on("pointerdown", function(pointer) {
            self.gameController.pickupGold(this.tileID, function () {
                console.log(self.tileID, self.tilesRef[self.tileID])
                if (self.tilesRef[self.tileID].getGold() > 0) {
                  console.log("amount on client-tile: ", self.tilesRef[self.tileID].getGold())
                  self.tilesRef[self.tileID].setGold(self.tilesRef[self.tileID].getGold() - 1)
                  console.log("amount on client-tile: ", self.tilesRef[self.tileID].getGold())   //amount of gold on tile is updated
                }
              })
            }, this)
      
        this.gameController.updatePickupGold(function (pointer) {
            if (self.tilesRef[self.tileID].getGold() > 0) {
                console.log(self.tilesRef[self.tileID].getGold())
                self.tilesRef[self.tileID].setGold(self.tilesRef[self.tileID].getGold() - 1)
                console.log(self.tilesRef[self.tileID].getGold())
            }
        })
    }

    public disconnectListeners() {
        //MUST be called before deleting the window, or else it will bug when opened subsequently!
        //turn off any socket.on(...) that u add here!
        // this.gameController.disconnectUpdateDropGold()
    }
}
