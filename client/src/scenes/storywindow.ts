import { Window } from "./window";
import { WindowManager } from "../utils/WindowManager"
import { storyCardWidths, storyCardHeights, 
        storyCardTexts, storyCardStyleText, storyCardStyleTitle } from '../constants'

export class StoryWindow extends Window {
    private key;
    private id;
    private nextButton: Phaser.GameObjects.Image;

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
    }

    protected initialize() {
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5);
        this.add.text(10, 10, storyCardTexts[this.id], storyCardStyleText);

        this.nextButton = this.add.image(this.width-30, this.height-30, 'okay');
        this.nextButton.setInteractive().setDisplaySize(30, 30).setOrigin(0);

        if (this.id == 0) {
            // Pause the collab scene for the initial story
            self.scene.sleep('collab');
        }
        // Start of game story and instructions, IDs 0, 1 and 2
        if (this.id == 0 || this.id == 1) {
            this.nextButton.on('pointerdown', function (pointer) {
                // start the next story window
                WindowManager.create(self, `story${this.id+1}`, StoryWindow, {
                    x: this.x + storyCardWidths[this.id]/2,
                    y: this.y + storyCardHeights[this.id]/2,
                    id: this.id+1
                })
                this.scene.remove(this.key)
            }, this);
        } else if (this.id == 2) {
            this.nextButton.on('pointerdown', function (pointer) {
                this.scene.bringToTop('collab')
                this.scene.wake('collab')
                this.scene.remove(this.key)
            }, this);
            // Legend A5: determine placement of the Rune Stones Legend
        }
    }
}