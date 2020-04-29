import { Window } from "./window";
import { game } from '../api/game';
import { Farmer } from "../objects/farmer";
import {WindowManager} from "../utils/WindowManager";
import {TradeWindow} from './tradewindow';
import { heroCardInfo } from '../constants';

export class HeroWindow extends Window {

    public icon
    public gold: number
    public will: number
    public str: number
    public farmers: number
    private goldtext
    private willtext
    private strtext
    private farmtext
    // private name
    private gameinstance: game;
    private clienthero;
    private windowhero;
    private key
    private windowherotile
    private clientherotile

    //items
    private largeItem: Phaser.GameObjects.Image;
    private helm: Phaser.GameObjects.Image;
    private smallItem1: Phaser.GameObjects.Image;
    private smallItem2: Phaser.GameObjects.Image;
    private smallItem3: Phaser.GameObjects.Image;
    private smallItem1key: string = "none";
    private smallItem2key: string = "none";
    private smallItem3key: string = "none";

    // drop buttons
    private goldDrop;
    private farmerDrop;
    private largeItemDrop;
    private helmDrop;
    private smallItem1Drop;
    private smallItem2Drop;
    private smallItem3Drop;

    public constructor(key: string, data) {
        super(key, { x: data.x, y: data.y, width: 400, height: 400 });
        this.key = key
        this.icon = data.icon
        this.gameinstance = data.controller
        this.gold = data.gold
        this.will = data.will
        this.str = data.strength
        this.farmers = data.farmers
        this.clienthero = data.clienthero
        this.windowhero = data.windowhero
        this.largeItem = data.largeItem
        this.windowherotile = data.currtileid
        this.clientherotile  = data.clientherotile
    }

    protected initialize() { 
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        this.add.sprite(20, 20, 'hero_border').setOrigin(0);
        this.add.sprite(24, 24, this.icon).setDisplaySize(72, 72).setOrigin(0);

        var buttonStyle = { 
            color: '#000000',
            backgroundColor: '#D9B382'
        }

        var dropButtonStyle = {
            color: '#FFFFFF',
            backgroundColor: '#D9B382',
            fontSize: 12
        }

        this.add.text(110, 20, heroCardInfo[`${this.windowhero}Name`], { color: 'fx00', fontSize: 35 });
        this.add.text(110, 65, heroCardInfo[`${this.windowhero}Desc`], { color: '#4B2504', fontSize: 14 });

        this.goldtext = this.add.text(190, 110, 'Gold: ' + this.gold, buttonStyle)
        this.goldDrop = this.add.text(300, 110, 'DROP', dropButtonStyle)
        this.farmtext = this.add.text(190, 130, 'Farmers: ' + this.farmers, buttonStyle)
        this.farmerDrop = this.add.text(300, 130, 'DROP', dropButtonStyle)
        this.willtext = this.add.text(20, 110, 'Willpower: ' + this.will, buttonStyle)
        this.strtext = this.add.text(20, 130, 'Strength: ' + this.str, buttonStyle)
        
        self.add.text(20,155,'Large item:', { color: 'fx00' });
        self.add.image(20, 175, 'item_border').setOrigin(0);
        this.largeItemDrop = this.add.text(70, 175, 'DROP', dropButtonStyle)
        self.add.text(190,155,'Helm:', { color: 'fx00' })
        self.add.image(190, 175, 'item_border').setOrigin(0);
        this.helmDrop = this.add.text(240, 175, 'DROP', dropButtonStyle)

        self.add.text(20,230,'Small items:', { color: 'fx00' })
        // 3 slots
        self.add.image(20, 250, 'item_border').setOrigin(0);
        this.smallItem1Drop = this.add.text(70, 250, 'DROP', dropButtonStyle)
        self.add.image(120, 250, 'item_border').setOrigin(0);
        this.smallItem2Drop = this.add.text(170, 250, 'DROP', dropButtonStyle)
        self.add.image(220, 250, 'item_border').setOrigin(0);
        this.smallItem3Drop = this.add.text(270, 250, 'DROP', dropButtonStyle)

        this.gameinstance.getHeroItems(self.windowhero, function(itemdict) {
            if (itemdict['largeItem'] != 'empty') {
                self.largeItem = self.add.image(25, 180, itemdict['largeItem']).setDisplaySize(35,35).setOrigin(0);
            }
            if (itemdict['helm'] != 'false') {
                self.helm = self.add.image(195, 180, 'helm').setDisplaySize(35,35).setOrigin(0);
            }
            if (itemdict['smallItems'].length > 0) {
                var smallItemList = itemdict['smallItems']
                for (var i = 0; i < smallItemList.length; i++) {
                    self.setSmallItemText(i, smallItemList[i])
                }
            }
        })

        this.add.text(20, 305, heroCardInfo[`${this.windowhero}Ability`], { color: '#4B2504', fontSize: 12 })

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

        var self = this
        if (this.clienthero == this.windowhero){
            this.goldDrop.setInteractive({useHandCursor: true})
            this.farmerDrop.setInteractive({useHandCursor: true})
            this.largeItemDrop.setInteractive({useHandCursor: true})
            this.helmDrop.setInteractive({useHandCursor: true})
            this.smallItem1Drop.setInteractive({useHandCursor: true})
            this.smallItem2Drop.setInteractive({useHandCursor: true})
            this.smallItem3Drop.setInteractive({useHandCursor: true})
        }
        
        // Drop farmer button
        this.farmerDrop.on('pointerdown', function (pointer) {
            self.gameinstance.dropFarmer(function (tilenum) {
                if(self.farmers > 0){
                    self.farmers--;
                    self.refreshText();
                }
            })

        }, this);

        // Drop gold button
        this.goldDrop.on('pointerdown', function () {            
            self.gameinstance.dropGold();
        });

        // While window is active, respond to updates in gold amount
        function updateGold(hk: string, goldDelta: number) {
            if (hk != self.windowhero) return;
            self.gold += goldDelta;
            self.refreshText();
        }
        this.gameinstance.updateDropGold(updateGold);
        this.gameinstance.updatePickupGold(updateGold);

        // Drop item button
        // itemName is only used for smallItems, defaults to "" otherwise and is unused
        function callDropItem(itemType: string, itemName: string = "") {
            self.gameinstance.dropItem(itemName, itemType);
        }
        this.largeItemDrop.on('pointerdown', function() { callDropItem("largeItem") });
        this.helmDrop.on('pointerdown', function() { callDropItem("helm") });
        this.smallItem1Drop.on('pointerdown', function() { callDropItem("smallItem", self.smallItem1key) });
        this.smallItem2Drop.on('pointerdown', function() { callDropItem("smallItem", self.smallItem2key) });
        this.smallItem3Drop.on('pointerdown', function() { callDropItem("smallItem", self.smallItem3key) });

        function dropItem(hk: string, itemName: string, itemType: string) {
            if (hk != self.windowhero) return;
            // remove the item image from the hero card depending on its type and name
            if (itemType == "largeItem") {
                self.largeItem.removeAllListeners('pointerdown')
                self.largeItem.destroy();
            } else if (itemType == "helm") {
                self.helm.removeAllListeners('pointerdown')
                self.helm.destroy();
            } else if (itemType == "smallItem") {
                if (self.smallItem1key == itemName) {
                    self.smallItem1.removeAllListeners('pointerdown')
                    self.smallItem1.destroy();
                    self.smallItem1key = "none";
                } else if (self.smallItem2key == itemName) {
                    self.smallItem2.removeAllListeners('pointerdown')
                    self.smallItem2.destroy();
                    self.smallItem2key = "none";
                } else if (self.smallItem3key == itemName) {
                    self.smallItem3.removeAllListeners('pointerdown')
                    self.smallItem3.destroy();
                    self.smallItem3key = "none";
                }
            }
        }
        this.gameinstance.updateDropItemHero(dropItem);
        function pickupItem(hk: string, itemName: string, itemType: string) {
            if (hk != self.windowhero) return;
            // add the item image from the hero card depending on its type and name
            if (itemType == "largeItem") {
                self.largeItem = self.add.image(25, 180, itemName).setDisplaySize(35,35).setOrigin(0);
            } else if (itemType == "helm") {
                self.helm = self.add.image(195, 180, 'helm').setDisplaySize(35,35).setOrigin(0);
            } else if (itemType == "smallItem") {
                // find first empty slot to add image to
                let slot = 2;
                if (self.smallItem1key == "none") {
                    slot = 0;
                } else if (self.smallItem2key == "none") {
                    slot = 1;
                }
                self.setSmallItemText(slot, itemName);
            }
        }
        this.gameinstance.updatePickupItemHero(pickupItem);

        // Updating other hero use of wineskin when viewing their HeroWindow
        // TODO: Will need to extend this to other consumable items
        this.gameinstance.receiveUseWineskin(function(hk: string, halforfull: string) {
            if (hk != self.windowhero) return;
            if (halforfull == 'full') {
                dropItem(hk, 'wineskin', 'smallItem');
                pickupItem(hk, "half_wineskin", "smallItem");
            } else {
                dropItem(hk, "half_wineskin", "smallItem");
            }
        })

        this.gameinstance.killHeroFarmers(() => {
            self.farmers = 0;
            self.refreshText();
        })

        // TODO WELL: Listen for well use (WP inc) and farmer pickups/drops

        //todo account for falcon
        console.log('ids:xxxxxxxxxxx', this.windowherotile, this.clientherotile)
        this.gameinstance.getHeroItems(this.clienthero, function(dict) {
            if (self.clienthero != self.windowhero && (self.windowherotile == self.clientherotile ) || self.clienthero != self.windowhero && dict['largeItem'] == 'falcon') {
                self.add.text(320,20, 'TRADE',{color: "#4944A4"}).setInteractive({useHandCursor: true}).on('pointerdown', function(pointer) {
                    self.gameinstance.sendTradeInvite(self.clienthero, self.windowhero)
                    WindowManager.create(self, 'tradewindow', TradeWindow, {gameinstance:self.gameinstance, hosthero:self.clienthero, inviteehero:self.windowhero, parentkey:self.key, clienthero:self.clienthero})
                }, self)
            }
        })

    }

    private setSmallItemText(slot:number, item) {
        var self = this

        function defineOnclick(itemIcon:Phaser.GameObjects.Image, itemtype, slot) {
            itemIcon.setInteractive({useHandCursor: true})
            switch(itemtype) {
                case 'wineskin':
                    itemIcon.on('pointerdown', function(pointer) {
                        //TODO: give free move and replace item with a half_wineskin
                        self.gameinstance.useWineskin('full', function() {
                            itemIcon.setTexture('half_wineskin').setDisplaySize(35, 35);
                            itemIcon.removeAllListeners('pointerdown')
                            defineOnclick(itemIcon,'half_wineskin', slot)
                            switch (slot) {
                                case 0: self.smallItem1key = "half_wineskin"; break;
                                case 1: self.smallItem2key = "half_wineskin"; break;
                                case 2: self.smallItem3key = "half_wineskin"; break;
                            }
                        })
                    })
                    break;
                case 'half_wineskin':
                    itemIcon.on('pointerdown', function(pointer) {
                        self.gameinstance.useWineskin('half', function() {
                            console.log('dont get drunk')
                            itemIcon.removeAllListeners('pointerdown')
                            itemIcon.destroy();
                            switch (slot) {
                                case 0: self.smallItem1key = "none"; break;
                                case 1: self.smallItem2key = "none"; break;
                                case 2: self.smallItem3key = "none"; break;
                            }
                        })
                    })
                    break;
                case 'herb':
                    itemIcon.on('pointerdown', function(pointer) {
                        //TODO: nothing i think
                    })
                    break;
                default:
                    console.log(itemtype, 'does nothing from herowindow.')
            }
        }

        switch (slot) {
            case 0:
                console.log("load image into slot 0", item);
                self.smallItem1 = self.add.image(25,255,item).setDisplaySize(35,35).setOrigin(0);
                self.smallItem1key = item;
                if (self.clienthero == self.windowhero){
                    defineOnclick(self.smallItem1, item, slot)
                }
                break;
            case 1:
                console.log("load image into slot 1", item);
                self.smallItem2 = self.add.image(125,255,item).setDisplaySize(35,35).setOrigin(0);
                self.smallItem2key = item;
                if (self.clienthero == self.windowhero){
                    defineOnclick(self.smallItem2, item, slot)
                }
                break;
            case 2:
                console.log("load image into slot 2", item);
                self.smallItem3 = self.add.image(225,255,item).setDisplaySize(35,35).setOrigin(0);
                self.smallItem3key = item;
                if (self.clienthero == self.windowhero){
                    defineOnclick(self.smallItem3, item, slot)
                }
                break;
        }
    }

    public setGold(amt: number) {
        this.gold = amt
        this.goldtext.setText('Gold: ' + this.gold)
        // this.refreshText()
    }

    public setStr(amt: number) {
        this.str = amt
        this.strtext.setText('Strength: ' + this.str)
        // this.refreshText()
    }

    public setWill(amt: number) {
        this.will = amt
        this.willtext.setText('Willpower: ' + this.will)
        // this.refreshText()
    }

    // public setName(name: string) {
    //     this.name = name
    //     this.refreshText()
    // }

    private refreshText() {
        this.goldtext.setText('Gold: ' + this.gold)
        // this.willtext.setText('Willpower: ' + this.will)
        this.farmtext.setText('Farmers: ' + this.farmers)
    }

    public disconnectListeners() {
        //MUST be called before deleting the window, or else it will bug when opened subsequently!
        //turn off any socket.on(...) that u add here!
        this.gameinstance.disconnectUpdateDropGold();
        this.gameinstance.disconnectUpdatePickupGold();
        this.gameinstance.disconnectUpdateDropItemHero();
        this.gameinstance.disconnectUpdatePickupItemHero();
        this.gameinstance.disconnectReceiveUseWineskin();
        this.gameinstance.unsubscribeKillHeroFarmers();
    }
}