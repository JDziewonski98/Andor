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
    private name
    private gameinstance: game;
    private clienthero;
    private windowhero;
    private key
    private windowherotile
    private clientherotile

    //items
    private largeItem;
    private smallItem1;
    private smallItem2;
    private smallItem3;

    public constructor(key: string, data) {
        super(key, { x: data.x, y: data.y, width: 400, height: 400 });
        this.key = key
        this.icon = data.icon
        this.name = data.name
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
        this.add.text(110, 20, heroCardInfo[`${this.name}Name`], { color: 'fx00', fontSize: 35 });
        this.add.text(110, 65, heroCardInfo[`${this.name}Desc`], { color: '#4B2504', fontSize: 14 });
        this.goldtext = this.add.text(190, 110, 'Gold: ' + this.gold, buttonStyle)
        this.farmtext = this.add.text(190, 130, 'Farmers: ' + this.farmers, buttonStyle)
        this.willtext = this.add.text(20, 110, 'Willpower: ' + this.will, buttonStyle)
        this.strtext = this.add.text(20, 130, 'Strength: ' + this.str, buttonStyle)
        
        this.gameinstance.getHeroItems(self.windowhero, function(itemdict) {
            self.add.text(20,155,'Large item:', { color: 'fx00' }); //+ itemdict['largeItem']);
            self.add.image(20, 175, 'item_border').setOrigin(0);
            if (itemdict['largeItem'] != 'empty') {
                // make interactive
                self.add.image(25, 180, 'bow').setDisplaySize(35,35).setOrigin(0);
            }
            self.add.text(190,155,'Helm:', { color: 'fx00' })
            self.add.image(190, 175, 'item_border').setOrigin(0);
            if (itemdict['helm'] != 'false') {
                // make interactive
                self.add.image(195, 180, 'helm').setDisplaySize(35,35).setOrigin(0);
            }
            self.add.text(20,230,'Small items:', { color: 'fx00' })
            // 3 slots
            self.add.image(20, 250, 'item_border').setOrigin(0);
            self.add.image(80, 250, 'item_border').setOrigin(0);
            self.add.image(140, 250, 'item_border').setOrigin(0);
            if (itemdict['smallItems'].length > 0) {
                var smallItemList = itemdict['smallItems']
                for (var i = 0; i < smallItemList.length; i++) {
                    self.setSmallItemText(i, smallItemList[i])
                }
            }
            //TODO_PICKUP: add other items as theyre added
        })
        this.add.text(20, 305, heroCardInfo[`${this.name}Ability`], { color: '#4B2504', fontSize: 12 })

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
            this.farmtext.setInteractive()
        }
        this.farmtext.on('pointerdown', function (pointer) {
            self.gameinstance.dropFarmer(function (tilenum) {
                if(self.farmers > 0){
                    self.farmers--;
                    self.farmtext = self.add.text(25, 160, 'Farmers: ' + self.farmers, { backgroundColor: 'fx00' })
                }
            })

        }, this);

        if (this.clienthero == this.windowhero){ 
            this.goldtext.setInteractive()
        }

        this.goldtext.on('pointerdown', function () {            
            self.gameinstance.dropGold();
        });

        // While window is active, respond to updates in gold amount
        function updateGold(hk: string, goldDelta: number) {
            if (hk != self.name) return;
            self.gold += goldDelta;
            self.refreshText();
        }
        this.gameinstance.updateDropGold(updateGold);
        this.gameinstance.updatePickupGold(updateGold);

        //todo account for falcon
        console.log('ids:xxxxxxxxxxx', this.windowherotile, this.clientherotile)
        if (this.clienthero != this.windowhero && (this.windowherotile == this.clientherotile )) {
            this.add.text(320,20, 'TRADE',{color: "#4944A4"}).setInteractive().on('pointerdown', function(pointer) {
                self.gameinstance.sendTradeInvite(self.clienthero, self.windowhero)
                WindowManager.create(this, 'tradewindow', TradeWindow, {gameinstance:self.gameinstance, hosthero:self.clienthero, inviteehero:self.windowhero, parentkey:self.key, clienthero:self.clienthero})
            }, this)
        }

    }

    private setSmallItemText(slot:number, item) {
        var self = this

        function defineOnclick(itemIcon:Phaser.GameObjects.Image, itemtype) {
            itemIcon.setInteractive()
            switch(itemtype) {
                case 'wineskin':
                    itemIcon.on('pointerdown', function(pointer) {
                        //TODO: give free move and replace item with a half_wineskin
                        self.gameinstance.useWineskin('full', function() {
                            itemIcon.setTexture('half_wineskin').setDisplaySize(35, 35);
                            itemIcon.removeAllListeners('pointerdown')
                            defineOnclick(itemIcon,'half_wineskin')
                        })
                    })
                    break;
                case 'half_wineskin':
                    itemIcon.on('pointerdown', function(pointer) {
                        self.gameinstance.useWineskin('half', function() {
                            console.log('dont get drunk')
                            itemIcon.removeAllListeners('pointerdown')
                            itemIcon.destroy();
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
                if (self.clienthero == self.windowhero){
                    defineOnclick(self.smallItem1, item)
                }
                break;
            case 1:
                console.log("load image into slot 1", item);
                self.smallItem2 = self.add.image(85,255,item).setDisplaySize(35,35).setOrigin(0);
                if (self.clienthero == self.windowhero){
                    defineOnclick(self.smallItem2, item)
                }
                break;
            case 2:
                console.log("load image into slot 2", item);
                self.smallItem3 = self.add.image(145,255,item).setDisplaySize(35,35).setOrigin(0);
                if (self.clienthero == self.windowhero){
                    defineOnclick(self.smallItem3, item)
                }
                break;
        }
    }

    public setGold(amt: number) {
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
        this.goldtext.setText('Gold: ' + this.gold)
        this.willtext.setText('Willpower: ' + this.will)
        
    }

    public disconnectListeners() {
        //MUST be called before deleting the window, or else it will bug when opened subsequently!
        //turn off any socket.on(...) that u add here!
        this.gameinstance.disconnectUpdateDropGold();
        this.gameinstance.disconnectUpdatePickupGold();
    }
}