import { Window } from "./window";
import { game } from '../api/game';

export class TradeWindow extends Window {
    private parentkey: String
    private gameinstance: game
    private windowname
    private hosthero
    private inviteehero
    private clienthero

    private HEADERTEXT_Y = 25
    private HOST_ITEM_X = 60
    private INVITEE_ITEM_X = 564
    private HELM_Y = 20
    private LARGE_Y = 100
    private SMALL_Y = [180, 260, 340]
    private GOLD_Y = 420
    private OFFER_OFFSET = 120

    private host_offers = {'smallItems':[],'largeItem':'None','helm':'None','gold':0}
    private invitee_offers = {'smallItems':[],'largeItem':'None','helm':'None','gold':0}

    public constructor(key: string, data, windowData = { x: 350, y: 30, width: 624, height: 624 }) {
        super(key, windowData);
        this.gameinstance = data.gameinstance
        this.parentkey = data.parentkey
        this.windowname = key
        this.hosthero = data.hosthero
        this.inviteehero = data.inviteehero
        //add
        this.clienthero = data.clienthero
    }

    protected initialize() {
        var self = this
        var bg = this.add.image(312, 312, 'trademenubg')
        this.addTexts()

        this.gameinstance.getHeroItems(this.hosthero, function(itemdict) {
            if (itemdict['helm'] != 'false') {
                let helm = self.add.sprite(self.HOST_ITEM_X, self.HELM_Y, 'helm').setInteractive()
                self.addOnClick(helm,self.clienthero,'helm')
            }
            if (itemdict['largeItem'] != 'empty') {
                let largeitem = self.add.sprite(self.HOST_ITEM_X, self.LARGE_Y, itemdict['largeItem']).setInteractive()
                self.addOnClick(largeitem,self.clienthero,'largeItem')
            }
            if (itemdict['smallItems'].length > 0) {
                for (let i = 0; i < itemdict['smallItems'].length; i++) {
                    let smallitem = self.add.sprite(self.HOST_ITEM_X, self.SMALL_Y[i], itemdict['smallItems'][i]).setInteractive()
                    self.addOnClick(smallitem,self.clienthero,'smallItems')
                }
            }
            self.add.text(self.HOST_ITEM_X - 20, self.GOLD_Y, 'Gold: ' + itemdict['gold'],{color: "#4944A4"}).setInteractive()
        })

        this.gameinstance.getHeroItems(this.inviteehero, function(itemdict) {
            if (itemdict['helm'] != 'false') {
                self.add.sprite(self.INVITEE_ITEM_X, self.HELM_Y, 'helm').setInteractive()
            }
            if (itemdict['largeItem'] != 'empty') {
                self.add.sprite(self.INVITEE_ITEM_X, self.LARGE_Y, itemdict['largeItem']).setInteractive()
            }
            if (itemdict['smallItems'].length > 0) {
                for (let i = 0; i < itemdict['smallItems'].length; i++) {
                    self.add.sprite(self.INVITEE_ITEM_X, self.SMALL_Y[i], itemdict['smallItems'][i]).setInteractive()
                }
            }
            self.add.text(self.INVITEE_ITEM_X - 20, self.GOLD_Y, 'Gold: ' + itemdict['gold'], {color: "#4944A4"}).setInteractive()
        })


    }

    private addOnClick(icon, hero, itemtype) {
        var self = this
        console.log('here')
        icon.on('pointerdown', function(pointer) {
            console.log('here2')
            if (self.clienthero == hero) {
                var itemname = icon.texture.key
                if (hero == self.hosthero ) {
                    console.log('here3')
                    if (icon.x == self.HOST_ITEM_X) {
                        icon.x = icon.x + self.OFFER_OFFSET
                        if (itemtype == 'smallItems') {
                            self.host_offers['smallItems'].push(itemname)
                        }
                        else{
                            self.host_offers[itemtype] = itemname
                        }
                    }
                    else {
                        icon.x = self.HOST_ITEM_X
                        if (itemtype == 'smallItems') {
                            const index = self.host_offers['smallItems'].indexOf(itemname);
                            if (index > -1) {
                            self.host_offers['smallItems'].splice(index, 1);
                            }
                        }
                        else{
                            self.host_offers[itemtype] = 'None'
                        }
                    }
                }
                else {

                }
            }
            console.log(self.host_offers)
            console.log(self.invitee_offers)
        })
    }

    private addTexts() {
        this.add.text(this.HOST_ITEM_X, this.HEADERTEXT_Y, 'Host items:', {color: "#4944A4"})
        this.add.text(this.HOST_ITEM_X + this.OFFER_OFFSET, this.HEADERTEXT_Y, 'Host offers:',{color: "#4944A4"})
        this.add.text(this.INVITEE_ITEM_X - this.OFFER_OFFSET, this.HEADERTEXT_Y, 'Invitee offers:', {color: "#4944A4"})
        this.add.text(this.INVITEE_ITEM_X, this.HEADERTEXT_Y, 'Invitee items:',{color: "#4944A4"})
    }

}