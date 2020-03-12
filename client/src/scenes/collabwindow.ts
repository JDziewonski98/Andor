import { Window } from "./window";
import { WindowManager } from "../utils/WindowManager";
import { Hero } from '../objects/hero';
import { game } from '../api/game';
import { collabTextHeight, collabColWidth, collabRowHeight } from '../constants'
import { ResourceToggle } from "../widgets/ResourceToggle";

export class CollabWindow extends Window {
    private submitText;
    private acceptText;
    private hasAccepted = false;

    // Should know what resources are being distributed, how many of each there are
    // to distribute, what heroes are participating in the decision, and which hero
    // is the owner of the decision. Pass into constructor
    private involvedHeroes: Hero[];
    private isOwner: boolean;
    private resources; // some kind of dictionary (itemType: quantity)
    private resAllocated = {}; // track what has been allocated to who
    
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
        this.isOwner = data.isOwner;
        this.x = data.x;
        this.y = data.y;
        this.width = data.w;
        this.height = data.h;

        if (this.isOwner) {
            this.involvedHeroes = data.heroes;
            this.resources = data.resources;
            this.textOptions = data.textOptions;
        }
    }

    protected initialize() {
        var self = this

        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5);
        this.populateWindow();

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
            console.log("Callback: successfully submitted decision");

            // Resume main game scene when collab decision is complete
            self.scene.resume('Game');
            self.scene.remove('collab');
        }
        function submitFailure() {
            console.log("Callback: submit decision failed - not enough accepts");
        }
        function setAccepted(numAccepted) {
            self.hasAccepted = true;
            console.log("Callback: successfully accepted decision, numAccepted: ", numAccepted);
        }
    }

    private populateWindow() {
        // Dynamically populate window based on its size
        var self = this;

        var textStyle = {
            backgroundColor: 'fx00',
            fontSize: collabTextHeight
        }
        
        // Done populating if this is just an accept window
        if (!this.isOwner) {
            this.acceptText = this.add.text(this.width/2, this.height-collabTextHeight, 'Accept', textStyle)

            this.acceptText.setInteractive()
            this.acceptText.on('pointerdown', function (pointer) {
                console.log("Current distribution", self.resAllocated);
                if (self.hasAccepted) {
                    console.log("You have already accepted this decision");
                    return;
                }
                self.gameinstance.collabDecisionAccept();
            });

            return;
        }

        this.submitText = this.add.text(0, this.height-collabTextHeight, 'Submit', textStyle)

        this.submitText.setInteractive()
        this.submitText.on('pointerdown', function (pointer) {
            self.gameinstance.collabDecisionSubmit(self.resAllocated);
        });

        // For resource splitting collabs
        if (this.resources) {
            var numResources = Object.keys(this.resources).length;

            for (let i=0; i<this.involvedHeroes.length; i++) {
                // initiate all allocated resources to 0 for all heroes
                let heroKindString = this.involvedHeroes[i].getKind().toString();
                let initialResources = [];
                initialResources.length = numResources;
                initialResources.fill(0);
                this.resAllocated[heroKindString] = initialResources;
            }

            // Populate window with resource grid
            for (let row=0; row<this.involvedHeroes.length; row++) {
                for (let col=0; col<numResources+1; col++) {
                    let heroKindString = this.involvedHeroes[row].getKind().toString();
                    if (col == 0) {
                        // Name of hero
                        this.add.text(0, (row+1)*collabRowHeight, heroKindString, textStyle);
                        continue;
                    }
                    new ResourceToggle(this, col*collabColWidth, (row+1)*collabRowHeight, heroKindString, col-1, this.resAllocated);
                }
            }
        }
        // Add resource "columns" headers
        if (this.resources != null) {
            Object.keys(self.resources).forEach(function(key, index) {
                self.add.text((index+1)*collabColWidth, 0, key, textStyle);
            })
        } else if (this.textOptions != null) {
            // Not used for this milestone
        }
    }
}