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
    private resources: Map<string, number>;
    private resourceNames: string[] = [];
    private resAllocated: Map<string, number[]> = new Map(); // track what has been allocated to who
    
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

        // Initialize list of resource names
        Array.from(this.resources.keys()).forEach( key => {
            this.resourceNames.push(key);
        });
        console.log(this.resourceNames);

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
            // Check that resAllocated corresponds with specified quantities from data.resources
            if (self.verifyAllocated()) {
                // Need to convert map TS object to send to server
                let convMap = {};
                self.resAllocated.forEach((val: number[], key: string) => {
                    convMap[key] = val;
                });
                // Pass map of allocated resources and list of resource names to map allocated 
                // quantities to the name of the corresponding resource
                self.gameinstance.collabDecisionSubmit(convMap, self.resourceNames);
            } else {
                console.log("Allocated quantities do not match those specified");
            }
        });

        // For resource splitting collabs
        if (this.resources) {
            var numResources = this.resources.size;

            for (let i=0; i<this.involvedHeroes.length; i++) {
                // initiate all allocated resources to 0 for all heroes
                let heroKindString = this.involvedHeroes[i].getKind().toString();
                let initialResources = [];
                initialResources.length = numResources;
                initialResources.fill(0);
                this.resAllocated.set(heroKindString, initialResources);
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
                    // this.resources.get(Array.from(this.resources.keys())[col-1]) used to get the total amount of the resource
                    // available to allocate, passed through data.resources in constructor
                    new ResourceToggle(this, col*collabColWidth, (row+1)*collabRowHeight, 
                        heroKindString, col-1, this.resources.get(Array.from(this.resources.keys())[col-1]),this.resAllocated);
                }
            }
        }
        // Add resource "columns" headers
        if (this.resources) {
            let col = 1;
            Array.from(this.resources.keys()).forEach( key =>
                self.add.text((col++)*collabColWidth, 0, key, textStyle)
            );
        } else if (this.textOptions != null) {
            // Not used for this milestone
        }
    }

    private verifyAllocated() {
        var self = this;
        
        var currTotals = [];
        currTotals.length = this.resources.size;
        currTotals.fill(0);
        Array.from(this.resAllocated.values()).forEach( counts => {
            for (let i=0; i<counts.length; i++) {
                currTotals[i] += counts[i];
            }
        });
        console.log(currTotals);

        var resMaxes = Array.from(this.resources.values());
        for (let i=0; i<resMaxes.length; i++) {
            if (resMaxes[i] != currTotals[i]) {
                console.log("resource", i, "count did not match");
                return false;
            }
        }
        return true;
    }
}