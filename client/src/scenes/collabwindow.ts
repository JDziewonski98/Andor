import { Window } from "./window";
import { WindowManager } from "../utils/WindowManager";
import { game } from '../api/game';
import { collabTextHeight, collabColWidth, collabRowHeight } from '../constants'

export class CollabWindow extends Window {
    private submitText;
    private acceptText;
    private hasAccepted = false;

    // Should know what resources are being distributed, how many of each there are
    // to distribute, what heroes are participating in the decision, and which hero
    // is the owner of the decision. Pass into constructor
    private involvedHeroes;
    private ownerHero;
    private resources; // some kind of dictionary (itemType: quantity)
    private allocated; // track what has been allocated to who
    
    private textOptions; // for some event cards, null if this is a resource split
    private selected; // current selected textOption

    private x;
    private y;
    private width;
    private height;

    private gameinstance: game;

    public constructor(key: string, data) {
        super(key, {x: data.x, y: data.y, width: data.w, height: data.h});
        this.gameinstance = data.controller;

        this.ownerHero = data.owner;
        this.involvedHeroes = data.heroes;
        this.resources = data.resources;
        this.textOptions = data.textOptions;

        this.x = data.x;
        this.y = data.y;
        this.width = data.w;
        this.height = data.h;
    }

    protected initialize() {
        var self = this

        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5);
        this.populateWindow();

        // Collab related actions
        this.acceptText.setInteractive()
        this.acceptText.on('pointerdown', function (pointer) {
            if (self.hasAccepted) {
                console.log("You have already accepted this decision");
                return;
            }
            self.gameinstance.collabDecisionAccept();
        });
        this.submitText.setInteractive()
        this.submitText.on('pointerdown', function (pointer) {
            self.gameinstance.collabDecisionSubmit();
        });

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

        // Callbacks
        // Submitting decision callback
        this.gameinstance.receiveDecisionSubmitSuccess(submitSuccess);
        this.gameinstance.receiveDecisionSubmitFailure(submitFailure);
        // Accepting decision callback
        this.gameinstance.receiveDecisionAccepted(setAccepted);

        function submitSuccess() {
            self.hasAccepted = false;
            // WindowManager.destroy(this, 'collab');
            console.log("Callback: successfully submitted decision")
        }
        function submitFailure() {
            console.log("Callback: submit decision failed")
        }
        function setAccepted(numAccepted) {
            self.hasAccepted = true;
            console.log("Callback: successfully accepted decision, numAccepted: ", numAccepted)
        }
    }

    private populateWindow() {
        // Dynamically populate window based on its size
        var self = this;

        var textStyle = {
            backgroundColor: 'fx00',
            fontSize: collabTextHeight
        }
        this.add.text(0, 0, 'Collab', textStyle)
        this.submitText = this.add.text(0, this.height-collabTextHeight, 'Submit decision', textStyle)
        this.acceptText = this.add.text(this.width/2, this.height-collabTextHeight, 'Accept decision', textStyle)

        // Add hero "rows"
        var currY = 20;
        for (var h in this.involvedHeroes) {
            // TODO collab: Replace text with hero kind
            this.add.text(0, currY, 'Hero', textStyle);
            currY += collabRowHeight;
        }

        // Add resource "columns"
        if (this.resources != null) {
            Object.keys(self.resources).forEach(function(key, index) {
                self.add.text((index+1)*collabColWidth, 0, key, textStyle);
            })
        } else if (this.textOptions != null) {
            // Not used for this milestone
        }
    }
}