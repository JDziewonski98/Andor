import { game } from '../api/game';
import { Window } from "./window";

export class TileWindow extends Window {
<<<<<<< HEAD
    private goldIcon: Phaser.GameObjects.Image;
    private goldButton: Phaser.GameObjects.Text;
    private currX = 30;
=======
    private goldButton: Phaser.GameObjects.Text;
    private startX = 5;
>>>>>>> Phil initial narrator work
    private xInc = 35;

    private gameController: game;
    private tileID: number;
<<<<<<< HEAD
    private items;
    private itemButtons: Map<string, Phaser.GameObjects.Text> = new Map();
    private itemIcons: Phaser.GameObjects.Image[] = [];
    private bgImage: Phaser.GameObjects.Image;
    private titleText: Phaser.GameObjects.Text;

    private goldQuantity: number;

    private windowHeight;
=======

    private goldQuantity: number;
    private itemQuantities = {};
>>>>>>> Phil initial narrator work

    public constructor(key: string, data) {
        super(key, { x: data.x, y: data.y, width: data.w, height: data.h });
        this.gameController = data.controller;
        this.tileID = data.tileID;
<<<<<<< HEAD
        this.items = data.items;
        this.windowHeight= data.h;
    }

    protected initialize() { 
        let itemsLength = Object.keys(this.items).length;
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

            if (self.itemButtons.has(itemName)) {
                let iconButton = self.itemButtons.get(itemName);
                // increase the quantity displayed
                let newAmount = Number(iconButton.text) + 1;
                iconButton.setText(""+newAmount);
            } else {
                // Add a new icon
                self.items[itemName] = 1;
                self.refreshWindow();
            }
        });
        this.gameController.updatePickupItemTile(function(tileID: number, itemName: string, itemType: string) {
            if (tileID != self.tileID) return;

            if (self.itemButtons.has(itemName)) {
                let iconButton = self.itemButtons.get(itemName);
                if (Number(iconButton.text) > 1) {
                    // reduce the quantity displayed
                    let newAmount = Number(iconButton.text) - 1;
                    iconButton.setText(""+newAmount);
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
=======
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
>>>>>>> Phil initial narrator work
            self.goldButton.setInteractive();
            self.goldButton.on("pointerdown", function(pointer) {
                self.gameController.pickupGold(self.tileID)
            }, this)
        });
<<<<<<< HEAD
    }

    // Populates the TileWindow with the list of items when it is initialized. Subsequent
    // updates while the TileWindow remains active on the screen are handled by refreshWindow()
    public populateItems() {
        var self = this;
        // Populate with items received from server
        for (let [key, value] of Object.entries(this.items)) {
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
    }

    // call this function every time the list is changed
    private refreshWindow() {
        this.clearWindow();

        let itemsLength = Object.keys(this.items).length;
        let extraWidth = 40 * (itemsLength > 1 ? itemsLength-1 : 0);
        let bgWidth = 110 + extraWidth;
        this.bgImage = this.add.image(0, 0, 'scrollbg').setDisplaySize(bgWidth, this.windowHeight).setOrigin(0);
        this.titleText = this.add.text(5, 5, `Region ${this.tileID} items:`, { fontSize: 10, backgroundColor: '#f00' });

        this.populateGold();

        var self = this;
        // Populate with items received from server
        for (let [key, value] of Object.entries(this.items)) {
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

        this.itemIcons.forEach(icon => icon.destroy());
        this.itemButtons.forEach(function(button) {
            button.removeAllListeners('pointerdown');
            button.destroy();
        })
        this.itemButtons.clear();
        this.itemIcons = [];

        this.currX = 30;
=======
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

>>>>>>> Phil initial narrator work
    }

    public refreshGold() {
        this.goldButton.setText(""+this.goldQuantity);
    }

    public disconnectListeners() {
        //MUST be called before deleting the window, or else it will bug when opened subsequently!
        //turn off any socket.on(...) that u add here!
        this.gameController.disconnectUpdateDropGoldTile()
        this.gameController.disconnectUpdatePickupGoldTile()
<<<<<<< HEAD
        this.gameController.disconnectUpdateDropItemTile();
        this.gameController.disconnectUpdatePickupItemTile();
=======
>>>>>>> Phil initial narrator work

        // event listeners
        this.goldButton.removeAllListeners('pointerdown');
    }
}
