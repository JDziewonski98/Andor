import { game } from '../api/game';
import { Window } from "./window";

export class TileWindow extends Window {
    private goldIcon: Phaser.GameObjects.Image;
    private goldButton: Phaser.GameObjects.Text;
    private currX = 30;

    private gameController: game;
    private tileID: number;
    private items;
    private itemButtons: Map<string, Phaser.GameObjects.Text> = new Map();
    private itemIcons: Phaser.GameObjects.Image[] = [];
    private bgImage: Phaser.GameObjects.Image;
    private titleText: Phaser.GameObjects.Text;
    private goldQuantity: number;
    // Special case for placing the hidden runestones
    private hiddenStoneIDs = ["blue_runestone_h", "yellow_runestone_h", "green_runestone_h"];

    private windowHeight;

    public constructor(key: string, data) {
        super(key, { x: data.x, y: data.y, width: data.w, height: data.h });
        this.gameController = data.controller;
        this.tileID = data.tileID;
        this.items = data.items;
        this.windowHeight= data.h;
    }

    protected initialize() { 
        // Ugly hack: Find extra width needed for hidden runestones
        let hiddenStoneExtraW = this.getNumExtraStones();
        let itemsLength = Object.keys(this.items).length + hiddenStoneExtraW;
        let extraWidth = 40 * (itemsLength > 1 ? itemsLength-1 : 0);
        // Size the background image based on how many distinct items need to be displayed
        let bgWidth = 110 + extraWidth;
        this.bgImage = this.add.image(0, 0, 'scrollbg').setDisplaySize(bgWidth, this.windowHeight).setOrigin(0);
        this.titleText = this.add.text(5, 5, `Region ${this.tileID} items:`, { fontSize: 10, backgroundColor: '#f00' });

        this.populateGold();
        this.populateItems();

        var self = this;

        // While window is active, listen for updates to the tile's gold and
        // update the GUI of the window accordingly.
        function updateGold(tileID: number, goldAmount: number) {
            if (tileID != self.tileID) return;
            self.goldQuantity = goldAmount;
            self.refreshGold();
        }
        this.gameController.updateDropGoldTile(updateGold);
        this.gameController.updatePickupGoldTile(updateGold);

        // While the window is active, listen for updates to the tile's items list and
        // update the GUI of the window accordingly.
        this.gameController.updateDropItemTile(function(tileID: number, itemName: string, itemType: string) {
            // either adds a new icon with quantity 1 or increments an existing quantity
            if (tileID != self.tileID) return;

            if (itemName in self.items) {
                // increase the quantity displayed
                self.items[itemName] += 1;
                // don't do this update for hidden runestones
                if (!self.hiddenStoneIDs.includes(itemName)) {
                    let iconButton = self.itemButtons.get(itemName);
                    iconButton.setText(""+self.items[itemName]);
                } else {
                    // Always refresh for hidden runestone drops
                    self.refreshWindow()
                }
            } else {
                // Add a new icon
                self.items[itemName] = 1;
                self.refreshWindow();
            }
        });
        this.gameController.updatePickupItemTile(function(tileID: number, itemName: string, itemType: string) {
            if (tileID != self.tileID) return;

            if (itemName in self.items) {
                let iconButton = self.itemButtons.get(itemName);
                if (self.items[itemName] > 1) {
                    self.items[itemName] -= 1;
                    // reduce the quantity displayed if not hidden runestone
                    if (!self.hiddenStoneIDs.includes(itemName)) {
                        let newAmount = Number(iconButton.text) - 1;
                        iconButton.setText(""+newAmount);
                    }
                } else {
                    // remove the item and re-populate the window
                    delete self.items[itemName];
                    self.refreshWindow();
                }
            } else {
                throw Error("Tried to pick up item that is not on tile");
            }
        });
    }

    // Populates the TileWindow with the current amount of gold.
    public populateGold() {
        var self = this;
        // Gold interaction (replaces addGold in GameScene)
        this.goldIcon = this.add.image(this.currX, 25, 'gold').setDisplaySize(30, 30).setOrigin(0);
        this.currX += 40;
        // Get the tile's gold amount from server
        this.gameController.getTileGold(this.tileID, function(goldAmount: number) {
            self.goldQuantity = goldAmount;
            self.goldButton = self.add.text(58, 23, ""+self.goldQuantity, { fontSize: 10, backgroundColor: '#f00' });
            self.goldButton.setInteractive();
            self.goldButton.on("pointerdown", function(pointer) {
                self.gameController.pickupGold(self.tileID)
            }, this)
        });
    }

    // Populates the TileWindow with the list of items when it is initialized. Subsequent
    // updates while the TileWindow remains active on the screen are handled by refreshWindow()
    public populateItems() {
        var self = this;

        // Populate with items received from server, note that hidden runestones are handled separately
        for (let [key, value] of Object.entries(this.items)) {
            if (this.hiddenStoneIDs.includes(key)) {
                continue;
            }
            var icon = this.add.image(this.currX, 25, key).setDisplaySize(30, 30).setOrigin(0);
            let buttonX = this.currX + 28;
            var iconButton = this.add.text(buttonX, 23, ""+value, { fontSize: 10, backgroundColor: '#f00' });
            iconButton.setInteractive();
            iconButton.on('pointerdown', function(pointer) {
                self.gameController.pickupItem(self.tileID, key, self.getItemTypeFromName(key));
            })
            this.itemButtons.set(key, iconButton);
            this.itemIcons.push(icon);

            this.currX += 40;
        }
        // Add hidden runestones
        for (let [key, value] of Object.entries(this.items)) {
            if (!this.hiddenStoneIDs.includes(key)) {
                continue;
            }
            for (let i = 0; i < value; i++) {
                var icon = this.add.image(this.currX, 25, key).setDisplaySize(30, 30).setOrigin(0);
                icon.setInteractive();
                // Request to server to reveal the runestone (key) on tile tileID
                icon.on('pointerdown', function() {
                    self.gameController.revealRunestone(self.tileID, key);
                })
                this.itemIcons.push(icon);
    
                this.currX += 40;
            }
        }
    }

    // call this function every time the list is changed
    private refreshWindow() {
        this.clearWindow();

        // Ugly hack: Find extra width needed for hidden runestones
        let hiddenStoneExtraW = this.getNumExtraStones();
        let itemsLength = Object.keys(this.items).length + hiddenStoneExtraW;
        let extraWidth = 40 * (itemsLength > 1 ? itemsLength-1 : 0);
        let bgWidth = 110 + extraWidth;
        this.bgImage = this.add.image(0, 0, 'scrollbg').setDisplaySize(bgWidth, this.windowHeight).setOrigin(0);
        this.titleText = this.add.text(5, 5, `Region ${this.tileID} items:`, { fontSize: 10, backgroundColor: '#f00' });

        this.populateGold();
        // Populate with items received from server
        this.populateItems();
    }

    //ugly
    private getNumExtraStones() : number {
        let hiddenStoneExtraW = 0;
        for (let [key, value] of Object.entries(this.items)) {
            if (!this.hiddenStoneIDs.includes(key)) {
                continue;
            }
            hiddenStoneExtraW -= 1;
            for (let i = 0; i < value; i++) {
                hiddenStoneExtraW += 1;
            }
        }
        return hiddenStoneExtraW;
    }

    // this is ugly for now
    private getItemTypeFromName(itemName: string) : string {
        let largeItems = ["falcon", "shield", "bow"]
        if (largeItems.includes(itemName)) {
            return "largeItem";
        } else if (itemName == "helm") {
            return "helm";
        } else {
            return "smallItem";
        }
    }

    // Remove all GameObjects from the window. This is an effective but ugly way of handling
    // refreshes of the TileWindow, which needs to dynamically update around the size of the
    // items list and the positions of the item icons as they are added and removed.
    public clearWindow() {
        this.bgImage.destroy();
        this.titleText.destroy();

        this.goldIcon.destroy();
        this.goldButton.removeAllListeners('pointerdown');
        this.goldButton.destroy();

        this.itemIcons.forEach(icon => {
            icon.removeAllListeners('pointerdown');
            icon.destroy()
        });
        this.itemButtons.forEach(button => {
            button.removeAllListeners('pointerdown');
            button.destroy();
        });
        this.itemButtons.clear();
        this.itemIcons = [];

        this.currX = 30;
    }

    public refreshGold() {
        this.goldButton.setText(""+this.goldQuantity);
    }

    public disconnectListeners() {
        //MUST be called before deleting the window, or else it will bug when opened subsequently!
        //turn off any socket.on(...) that u add here!
        this.gameController.disconnectUpdateDropGoldTile()
        this.gameController.disconnectUpdatePickupGoldTile()
        this.gameController.disconnectUpdateDropItemTile();
        this.gameController.disconnectUpdatePickupItemTile();

        // event listeners
        this.goldButton.removeAllListeners('pointerdown');
    }
}
