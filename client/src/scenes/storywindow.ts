import { Window } from "./window";
import { WindowManager } from "../utils/WindowManager"
import { storyCardWidths, storyCardHeights, 
        storyCardTexts, storyCardStyleText, storyCardStyleTitle } from '../constants'

export class StoryWindow extends Window {
    private key;
    private id;
    private okButton: Phaser.GameObjects.Image;
    private runestoneLocs;
    private gameController;

    private x;
    private y;
    private width;
    private height;

    public constructor(key: string, data) {
        super(key, 
            {
                x: data.x - storyCardWidths[data.id]/2, 
                y: data.y - storyCardHeights[data.id]/2,
                width: storyCardWidths[data.id],
                height: storyCardHeights[data.id]
            }
        );
        this.key = key;
        this.id = data.id;
        this.x = data.x - storyCardWidths[data.id]/2;
        this.y = data.y - storyCardHeights[data.id]/2;
        this.width = storyCardWidths[data.id];
        this.height = storyCardHeights[data.id];
        this.runestoneLocs = data.locs;
        if (data.gameController) {
            this.gameController = data.gameController;
        }
    }

    protected initialize() {
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5);
        var storyText = this.add.text(10, 10, storyCardTexts[this.id], storyCardStyleText);
        // Extra text for runestones legend
        var extraText;
        if (this.id == 6) {
            extraText = this.add.text(10, 130, `The locations of the stones have been discovered:\n${this.runestoneLocs}`, storyCardStyleText);
        }

        this.okButton = this.add.image(this.width-35, this.height-35, 'okay');
        this.okButton.setInteractive().setDisplaySize(30, 30).setOrigin(0);

        // Start of game story and instructions, IDs 0, 1 and 2
        let continueCards = [0, 1, 3, 4]
        if (continueCards.includes(this.id)) {
            this.okButton.on('pointerdown', function (pointer) {
                // start the next story window
                WindowManager.create(self, `story${this.id+1}`, StoryWindow, {
                    x: this.x + storyCardWidths[this.id]/2,
                    y: this.y + storyCardHeights[this.id]/2,
                    id: this.id+1,
                    gameController: this.gameController
                })
                this.scene.remove(this.key)
            }, this);
        } else if (this.id == 2) {
            // Legend A5: determine placement of the Rune Stones Legend
            this.gameController.logRunestoneLegendPos();
            this.okButton.on('pointerdown', function (pointer) {
                this.scene.bringToTop('collab')
                this.scene.wake('collab')
                this.scene.remove(this.key)
            }, this);
        } else {
            this.okButton.on('pointerdown', function (pointer) {
                this.scene.remove(this.key)
            }, this);
        }

        // Animate the "scene" in. Can't target the scene but can add everything to a container
        let storyContainer = this.add.container(0, 0, [bg, storyText, this.okButton]);
        if (extraText) {
            storyContainer.add(extraText);
        }
        storyContainer.alpha = 0;
        this.tweens.add({
            targets: storyContainer,
            duration: 500,
            alpha: 1
        })
    }
}