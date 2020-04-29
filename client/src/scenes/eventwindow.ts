import { Window } from "./window";
import { storyCardTexts, storyCardStyleText } from '../constants'

export class EventWindow extends Window {
    private key;
    private id;
    private okButton: Phaser.GameObjects.Image;
    private x;
    private flavorText;
    private descText;
    private w = 300;
    private h = 250;

    public constructor(key: string, data) {
        super(key, { x: data.x - 150, y: data.y - 125, width: 300, height: 250 });
        this.key = key;
        this.id = data.id;
        this.x = data.x - this.w/2;
        this.flavorText = data.flavorText;
        this.descText = data.descText;
        
    }

    protected initialize() {
        var self = this

        var titleStyle = {
            color: '#000000',
            backgroundColor: '#D9B382',
            fontSize: 16,
            align: "center",
            wordWrap: { width: 300-20, useAdvancedWrap: true }
        }
        var flavorTextStyle = {
            color: '#4B2504',
            fontSize: 12,
            fontStyle: 'italic',
            align: "center",
            wordWrap: { width: 300-20, useAdvancedWrap: true }
        }
        var descTextStyle = {
            color: '#4B2504',
            fontSize: 10,
            align: "center",
            wordWrap: { width: 300-20, useAdvancedWrap: true }
        }
        
        let currY = 10
        var title = this.add.text(this.w/2, currY, `Event Card ${this.id}`, titleStyle).setOrigin(0.5, 0);
        currY = currY + title.displayHeight + 20;
        var flavor = this.add.text(this.w/2, currY, this.flavorText, flavorTextStyle).setOrigin(0.5, 0);
        currY = currY + flavor.displayHeight + 10;
        var desc = this.add.text(this.w/2, currY, this.descText, descTextStyle).setOrigin(0.5, 0);
        currY = currY + desc.displayHeight + 50;
        var bg = this.add.image(0, 0, 'scrollbg').setDisplaySize(this.w, currY).setOrigin(0);

        this.okButton = this.add.image(this.w - 35, bg.displayHeight - 35, 'okay');
        this.okButton.setInteractive({useHandCursor: true}).setDisplaySize(30, 30).setOrigin(0);
        this.okButton.on('pointerdown', function (pointer) {
            if(this.id == 16){
                this.scene.remove(this.key)
            }
            else if (this.scene.get('collab')) {
                this.scene.bringToTop('collab')
                this.scene.wake('collab')
                this.scene.remove(this.key)
            }
            else{
                this.scene.remove(this.key)
            }
        }, this);

        // Animate the "scene" in. Can't target the scene but can add everything to a container
        let storyContainer = this.add.container(0, 0, [bg, title, flavor, desc, this.okButton]);
        storyContainer.alpha = 0;
        this.tweens.add({
            targets: storyContainer,
            duration: 500,
            alpha: 1
        })
    }
}