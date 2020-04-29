/*import { Window } from "./window";
import { game } from '../api/game';
import { WindowManager } from "../utils/WindowManager";
export class MerchantWindow extends Window {

    private yes;
    private no;
    private key;
    private gameinstance: game;

    public constructor(key: string, data, windowData = { x: 350, y: 30, width: 450, height: 150 }) {
        super(key, windowData);
        this.gameinstance = data.controller;
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

    
}*/

import { Window } from "./window";
import { game } from '../api/game';
import { Farmer } from "../objects/farmer";
import {WindowManager} from "../utils/WindowManager";
import {TradeWindow} from './tradewindow';
import { heroCardInfo } from '../constants';

export class MerchantWindow extends Window {

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

    // buy buttons
    private bowBuy
    private helmBuy;
    private shieldBuy;
    private falconBuy;
    private telescopeBuy;
    private wineBuy;
    private strengthBuy;

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
        this.add.sprite(24, 24, 'merchant-trade').setDisplaySize(72, 72).setOrigin(0);

        var buttonStyle = { 
            color: '#000000',
            backgroundColor: '#D9B382'
        }

        var buyButtonStyle = {
            color: '#FFFFFF',
            backgroundColor: '#D9B382',
            fontSize: 12
        }

        this.add.text(110, 20, 'Merchant', { color: 'fx00', fontSize: 35 });
        this.add.text(110, 65, "Strength points and all items here \ncan be purchased for 2 gold each.", { color: '#4B2504', fontSize: 14 });
        this.add.text(20, 110, "Hello there, weary traveller.\nLookin' to buy some goods eh?", { color: '#4B2504', fontSize: 14 });

        self.add.text(20,150,'Strength:', { color: 'fx00' });
        self.add.image(20, 175, 'item_border').setOrigin(0);
        self.add.image(25, 180, 'Strength').setOrigin(0).setDisplaySize(35,35);
        this.strengthBuy = this.add.text(80, 175, 'BUY', buyButtonStyle)
        this.strengthBuy.setInteractive({useHandCursor: true});

        var self = this
        this.strengthBuy.on('pointerdown', function (pointer) {
            self.gameinstance.merchant("strength", function(){
                WindowManager.destroy(self, self.key);
            });

        }, this);
        
        self.add.text(20,225,'Bow:', { color: 'fx00' });
        self.add.image(20, 245, 'item_border').setOrigin(0);
        self.add.image(25, 250, 'bow').setOrigin(0).setDisplaySize(35,35);
        this.bowBuy= this.add.text(70, 245, 'BUY', buyButtonStyle)
        this.bowBuy.setInteractive({useHandCursor: true})
        this.bowBuy.on('pointerdown', function (pointer) {
            self.gameinstance.merchant("bow", function(){
                WindowManager.destroy(self, self.key);
            });

        }, this);

        self.add.text(150, 225,'Helm:', { color: 'fx00' })
        self.add.image(150, 245, 'item_border').setOrigin(0);
        self.add.image(155, 250, 'helm').setOrigin(0).setDisplaySize(35,35);
        this.helmBuy = this.add.text(200, 245, 'BUY', buyButtonStyle)
        this.helmBuy.setInteractive({useHandCursor: true})

        this.helmBuy.on('pointerdown', function (pointer) {
            self.gameinstance.merchant("helm", function(){
                WindowManager.destroy(self, self.key);
            });

        }, this);

        self.add.text(270, 225,'Wineskin:', { color: 'fx00' })
        self.add.image(270, 245, 'item_border').setOrigin(0);
        self.add.image(275, 250, 'wineskin').setOrigin(0).setDisplaySize(35,35);
        this.wineBuy = this.add.text(320, 245, 'BUY', buyButtonStyle)
        this.wineBuy.setInteractive({useHandCursor: true})

        this.wineBuy.on('pointerdown', function (pointer) {
            self.gameinstance.merchant("wine", function(){
                WindowManager.destroy(self, self.key);
            });

        }, this);

        self.add.text(20,300,'Falcon:', { color: 'fx00' })
        self.add.image(20, 320, 'item_border').setOrigin(0);
        self.add.image(25, 325, 'falcon').setOrigin(0).setDisplaySize(35,35);
        this.falconBuy= this.add.text(70, 320, 'BUY', buyButtonStyle)
        this.falconBuy.setInteractive({useHandCursor: true})

        this.falconBuy.on('pointerdown', function (pointer) {
            self.gameinstance.merchant("falcon", function(){
                WindowManager.destroy(self, self.key);
            });

        }, this);

        self.add.text(150,300,'Telescope:', { color: 'fx00' })
        self.add.image(150, 320, 'item_border').setOrigin(0);
        self.add.image(155, 325, 'telescope').setOrigin(0).setDisplaySize(35,35);
        this.telescopeBuy = this.add.text(200, 320, 'BUY', buyButtonStyle)
        this.telescopeBuy.setInteractive({useHandCursor: true})

        this.telescopeBuy.on('pointerdown', function (pointer) {
            self.gameinstance.merchant("telescope", function(){
                WindowManager.destroy(self, self.key);
            });

        }, this);

        self.add.text(270,300,'Shield:', { color: 'fx00' })
        self.add.image(270, 320, 'item_border').setOrigin(0);
        self.add.image(275, 325, 'shield').setOrigin(0).setDisplaySize(35,35);
        this.shieldBuy = this.add.text(320, 320, 'BUY', buyButtonStyle)
        this.shieldBuy.setInteractive({useHandCursor: true})

        this.shieldBuy.on('pointerdown', function (pointer) {
            self.gameinstance.merchant("shield", function(){
                WindowManager.destroy(self, self.key);
            });

        }, this);

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
        /*if (this.clienthero == this.windowhero){
            this.goldDrop.setInteractive()
            this.farmerDrop.setInteractive()
            this.largeItemDrop.setInteractive()
            this.helmDrop.setInteractive()
            this.smallItem1Drop.setInteractive()
            this.smallItem2Drop.setInteractive()
            this.smallItem3Drop.setInteractive()
        }*/
        
      

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
    }
}