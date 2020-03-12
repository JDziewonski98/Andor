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
    private ownerHero;
    private resources; // some kind of dictionary (itemType: quantity)
    private allocated = {}; // track what has been allocated to who
    
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
            console.log("Current distribution", self.allocated);
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
            // TODO collab: close window for all clients on successful submission
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
        
        this.submitText = this.add.text(0, this.height-collabTextHeight, 'Submit', textStyle)
        this.acceptText = this.add.text(this.width/2, this.height-collabTextHeight, 'Accept', textStyle)

        // For resource splitting collabs
        if (this.resources) {
            var numResources = Object.keys(this.resources).length;

            for (let i=0; i<this.involvedHeroes.length; i++) {
                // initiate all allocated resources to 0 for all heroes
                let heroKindString = this.involvedHeroes[i].getKind().toString();
                let initialResources = [];
                initialResources.length = numResources;
                initialResources.fill(0);
                this.allocated[heroKindString] = initialResources;
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
                    // For col > 0, display current allocation for hero at row of resource at col
                    // TODO collab: these text fields all need to be saved as state so they can be updated
                    new ResourceToggle(this, col*collabColWidth, (row+1)*collabRowHeight, heroKindString, col-1, this.allocated);
                    // this.add.text(col*collabColWidth, (row+1)*collabRowHeight, this.allocated[heroKindString][col-1]);
                }
            }
        }
        // Add resource "columns". TODO collab: 
        if (this.resources != null) {
            Object.keys(self.resources).forEach(function(key, index) {
                self.add.text((index+1)*collabColWidth, 0, key, textStyle);
            })
        } else if (this.textOptions != null) {
            // Not used for this milestone
        }
    }
}