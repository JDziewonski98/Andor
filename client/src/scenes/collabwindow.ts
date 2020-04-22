import { Window } from "./window";
import { game } from '../api/game';
import { collabTextHeight, collabColWidth, collabRowHeight,
        collabHeaderHeight, collabFooterHeight } from '../constants'
import { ResourceToggle } from "../widgets/ResourceToggle";
import BoardOverlay from "./boardoverlay";
import { HeroKind } from "../objects";

export class CollabWindow extends Window {
    private submitText;
    private acceptText;
    private hasAccepted = false;

    // Should know what resources are being distributed, how many of each there are
    // to distribute, what heroes are participating in the decision, and which hero
    // is the owner of the decision. Pass into constructor
    private involvedHeroes: HeroKind[];
    private heroAccepts: Map<string, Phaser.GameObjects.Text> = new Map();
    private isOwner: boolean;
    private resources: Map<string, number>;
    private resourceNames: string[] = [];
    private resourceMaxes: number[] = [];
    private resAllocated: Map<string, number[]> = new Map(); // track what has been allocated to who
    
    private textOptions; // for some event cards, null if this is a resource split
    private selected; // current selected textOption

    private x;
    private y;
    private width;
    private height;

    private gameinstance: game;
    private infight: boolean = false;

    private overlayRef: BoardOverlay;

    private name;
    
    private ownHeroKind: HeroKind
    private numAccepts
    private type
    private resourceToggles: Array<ResourceToggle>

    public constructor(key: string, data, incFunction) {
        super(key, {x: data.x, y: data.y, width: data.w, height: data.h});

        this.gameinstance = data.controller;
        this.isOwner = data.isOwner;
        this.x = data.x;
        this.y = data.y;
        this.width = data.w;
        this.height = data.h;
        this.infight = data.infight;
        this.overlayRef = data.overlayRef;
        this.name = key

        //if (this.isOwner) {
            this.involvedHeroes = data.involvedHeroes;
            this.resources = data.resources;
            this.textOptions = data.textOptions;
        //}
        this.ownHeroKind = data.ownHeroKind
        this.resourceToggles = new Array<ResourceToggle>()
        this.numAccepts = 0
        this.type = data.type

        //console.log(this.involvedHeroes)
    }

    protected initialize() {
        var self = this

        // Initialize lists of resource names and max values
        if (this.resources) {
            this.resources.forEach( (max, name) => {
                this.resourceMaxes.push(max);
                this.resourceNames.push(name);
            })
            console.log(this.resourceNames);
            console.log(this.resourceMaxes);
        }

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
        console.log('this: xxxxxx' , this)
        // Callbacks
        // Submitting decision callback
        console.log('in init', self.infight)

        this.gameinstance.incListener((resourceHeroKind, resourceIndex, senderHeroKind)=>{
            console.log("entered inc listener")
            var involved = false
            for(let hk of self.involvedHeroes){
                if(hk == senderHeroKind){
                    involved = true
                }
            }
            if(self.ownHeroKind == senderHeroKind){
                involved = false
            }
            if(involved){
                this.resetAccepts();
                for(let rt of this.resourceToggles){
                    if(rt.getResourceIndex() == resourceIndex && resourceHeroKind == rt.getHeroKind()){
                        //console.log(rt)
                        rt.incFunction()
                        //this.gameinstance.sendIncResource(resourceHeroKind,resourceIndex)
                    }        
                } 
            }
        })

        this.gameinstance.decListener((resourceHeroKind, resourceIndex, senderHeroKind)=>{
            console.log("entered dec listener")
            var involved = false
            for(let hk of self.involvedHeroes){
                if(hk == senderHeroKind){
                    involved = true
                }
            }
            if(self.ownHeroKind == senderHeroKind){
                involved = false
            }
            if(involved){
                this.resetAccepts();
                for(let rt of this.resourceToggles){
                    if(rt.getResourceIndex() == resourceIndex && resourceHeroKind == rt.getHeroKind()){
                        //console.log(rt)
                        rt.decFunction()
                        //this.gameinstance.sendIncResource(resourceHeroKind,resourceIndex)
                    }        
                } 
            }
        })

        this.gameinstance.acceptListener((heroKind) => {
            console.log("entered accept listener")
            var involved = false
            for(let hk of self.involvedHeroes){
                if(hk == heroKind){
                    involved = true
                }
            }
            if(self.ownHeroKind == heroKind){
                involved = false
            }
            if(involved){
                self.heroAccepts.get(heroKind).setColor('#037d50');
                self.numAccepts++
            }
            //console.log(self.numAccepts)
        })

        this.gameinstance.endCollabListener((involvedHeroKinds: HeroKind[]) =>{
            console.log("entered end collab listener")
            //console.log("we got it baby")
            //console.log(involvedHeroKinds)
            var involved = false
            for(let heroKind of involvedHeroKinds){
                if(heroKind == self.ownHeroKind){
                    involved = true
                }
            }
            if(involved){
                self.scene.resume('Game');

                // Reset overlay interactive
                self.overlayRef.toggleInteractive(true);
                
                self.scene.remove(self.name);
                self.gameinstance.unsubscribeListeners()
            }
        })
    }

    private populateWindow() {
        // Dynamically populate window based on its size
        var self = this;

        var textStyle = {
            color: '#4B2504',
            fontSize: collabTextHeight
        }
        var smallTextStyle = {
            color: '#d11313',
            fontSize: collabTextHeight - 2
        }
        var buttonStyle = {
            color: '#000000',
            backgroundColor: '#D9B382',
            fontSize: collabTextHeight
        }
        var titleStyle = {
            color: '#000000',
            backgroundColor: '#D9B382',
            fontSize: collabTextHeight,
            align: "center",
            wordWrap: { width: this.width-10, useAdvancedWrap: true }
        }

        let titleText = `Collaborative Decision:\nDistribute `
        let numRes = this.resourceNames.length;
        for (let i = 0; i < numRes; i++) {
            titleText += `${this.resourceMaxes[i]} ${this.resourceNames[i]} `;
            if (i == numRes - 2) {
                titleText += 'and ';
            } else if (i < numRes - 2) {
                titleText += ', ';
            }
        }
        this.add.text(this.width/2, 5, titleText, titleStyle).setOrigin(0.5, 0);

        // Bottom hero icons and acceptance statuses
        let numInvolved = this.involvedHeroes.length;
        let spacing = 3 * (numInvolved - 1); // 6 pixels spacing between each icon
        let currX = this.width/2 - (numInvolved - 1) * 20 - spacing;
        for (let i=0; i<numInvolved; i++) {
            let heroKind = this.involvedHeroes[i];
            this.add.image(currX, this.height-57, heroKind).setOrigin(0.5, 0).setDisplaySize(40, 40);
            // acceptance status
            if (heroKind == this.ownHeroKind) {
                this.acceptText = this.add.text(currX, this.height-18, 'Accept', buttonStyle).setOrigin(0.5, 0);
                this.heroAccepts.set(heroKind, this.acceptText);
            } else {
                this.heroAccepts.set(heroKind, this.add.text(currX, this.height-16, 'Accept', smallTextStyle).setOrigin(0.5, 0))
            }
            currX += 46;
        }
        
        this.acceptText.setInteractive()
        this.acceptText.on('pointerdown', function (pointer) {
            if(!self.hasAccepted){
               // Check that resAllocated corresponds with specified quantities from data.resources
                if (self.verifyAllocated()) {
                    self.hasAccepted = true
                    self.acceptText.setColor('#037d50')

                    //emit server call
                    self.gameinstance.sendAccept(self.ownHeroKind)

                    self.numAccepts++
                    //if last to accept, initiate ending of collab
                    if(self.numAccepts == self.involvedHeroes.length){
                        let convMap = {};
                        // Need to convert map TS object to send to server
                        self.resAllocated.forEach((val: number[], key: string) => {
                            convMap[key] = val;
                        });
                        //emit end collab call
                        // Pass map of allocated resources and list of resource names to map allocated 
                        // quantities to the name of the corresponding resource
                        //console.log(self.involvedHeroes)
                        var involvedHeroKinds = new Array<HeroKind>()
                        for(let hk of self.involvedHeroes){
                            involvedHeroKinds.push(hk)
                        }
                        self.gameinstance.sendEndCollab(convMap, self.resourceNames, involvedHeroKinds)
                    }
                    //self.gameinstance.collabDecisionSubmit(convMap, self.resourceNames, self.involvedHeroes);
                    //
                } else {
                    console.log("Allocated quantities do not match those specified");
                    self.acceptText.setText("Invalid")
                    self.acceptText.setColor('#d11313')
                    setTimeout(function(){
                        self.acceptText.setText("Accept");
                        self.acceptText.setColor('#000000')
                    }, 2000);
                } 
            }
            
        });

        // For resource splitting collabs
        if (this.resources) {
            var numResources = this.resources.size;

            // initiate all allocated resources to 0 for all heroes
            for (let i=0; i<this.involvedHeroes.length; i++) {
                let heroKindString = this.involvedHeroes[i];
                let initialResources = [];
                initialResources.length = numResources;
                initialResources.fill(0);
                this.resAllocated.set(heroKindString, initialResources);
            }

            // Populate window with resource grid
            for (let row=0; row<this.involvedHeroes.length; row++) {
                for (let col=0; col<numResources+1; col++) {
                    let heroKindString = this.involvedHeroes[row];
                    let yPos = collabHeaderHeight + row*collabRowHeight
                    // Special case for single resource distribution, just to make spacing look better
                    let heroXPos = 5;
                    let resXPos = col*collabColWidth;
                    if (numResources == 1) {
                        heroXPos = this.width/2 - collabColWidth;
                        resXPos = this.width/2 + 10;
                    }
                    if (col == 0) {
                        // Name of hero
                        this.add.text(heroXPos, yPos, heroKindString, textStyle);
                        continue;
                    }
                    this.resourceToggles.push(new ResourceToggle(this, resXPos, yPos, heroKindString, 
                        col-1, this.resourceNames[col], this.resourceMaxes[col], this.resAllocated));
                }
            }
        }
        // Add resource "columns" headers
        if (this.resources) {
            let col = 1;
            for (let i=0; i<this.resourceNames.length; i++) {
                let xPos = (col++)*collabColWidth;
                if (numResources == 1) {
                    xPos = this.width/2 + 5;
                }
                self.add.text(xPos, 50, this.resourceNames[i], textStyle)
            }
        } else if (this.textOptions != null) {
            // Not used for this milestone
        }
    }

    private verifyAllocated() {
        if(this.type == 'distribute'){
            var self = this;
            var currTotals = [];
            currTotals.length = this.resources.size;
            currTotals.fill(0);
            Array.from(this.resAllocated.values()).forEach( counts => {
                for (let i=0; i<counts.length; i++) {
                    currTotals[i] += counts[i];
                }
            });
            //console.log(currTotals);
            var resMaxes = Array.from(this.resources.values());
            for (let i=0; i<resMaxes.length; i++) {
                if (resMaxes[i] != currTotals[i]) {
                    console.log("resource", i, "count did not match");
                    return false;
                }
            }
            return true;
        }
        else if(this.type == 'singleItemPay'){
            var self = this;
            var currTotals = [];
            currTotals.length = this.resources.size;
            currTotals.fill(0);
            Array.from(this.resAllocated.values()).forEach( counts => {
                for (let i=0; i<counts.length; i++) {
                    currTotals[i] += counts[i];
                }
            });
            //console.log(currTotals);
            var total = 0
            for(let value of currTotals){
                total += value
            }
            
            // var resMaxes = Array.from(this.resources.values());
            // for (let i=0; i<resMaxes.length; i++) {
            //     if (resMaxes[i] != currTotals[i]) {
            //         console.log("resource", i, "count did not match");
            //         return false;
            //     }
            // }
            if(total == 0 || total == 1){
                return true
            }
            return false;
        }
        else if(this.type == "singleDistribution"){
            console.log("singy")
            var self = this;
            var currTotals = [];
            currTotals.length = this.resources.size;
            currTotals.fill(0);
            console.log(Array.from(this.resAllocated))
            Array.from(this.resAllocated.values()).forEach( counts => {
                console.log(counts)
                for (let i=0; i<counts.length; i++) {
                    if(counts[i] > 1){
                        return false
                    }
                    currTotals[i] += counts[i];
                    
                }
            });
            //console.log(currTotals);
            var resMaxes = Array.from(this.resources.values());
            for (let i=0; i<resMaxes.length; i++) {
                if (resMaxes[i] != currTotals[i]) {
                    console.log("resource", i, "count did not match");
                    return false;
                }
            }
            return true;
        }
        else if(this.type == 'allOrNothing'){
            var self = this;
            var currTotals = [];
            currTotals.length = this.resources.size;
            currTotals.fill(0);
            Array.from(this.resAllocated.values()).forEach( counts => {
                for (let i=0; i<counts.length; i++) {
                    currTotals[i] += counts[i];
                }
            });
            //console.log(currTotals);
            var resMaxes = Array.from(this.resources.values());
            for (let i=0; i<resMaxes.length; i++) {
                if (resMaxes[i] != currTotals[i] && currTotals[i]!= 0) {
                    console.log("resource", i, "count did not match");
                    return false;
                }
            }
            return true;
        }
    }

    public incFunction(heroKind, resourceIndex){
        //ignoring checks for now
        for(let rt of this.resourceToggles){
            if(rt.getResourceIndex() == resourceIndex && heroKind == rt.getHeroKind()){
                //console.log(rt)
                // Reset hero accepts
                this.resetAccepts();
                this.numAccepts = 0;
                rt.incFunction()
                this.gameinstance.sendIncResource(heroKind,resourceIndex)
            }        
        }
    }

    public decFunction(heroKind, resourceIndex){
        //ignoring checks for now
        for(let rt of this.resourceToggles){
            if(rt.getResourceIndex() == resourceIndex && heroKind == rt.getHeroKind()){
                //console.log(rt)
                // Reset hero accepts
                this.resetAccepts();
                rt.decFunction()
                this.gameinstance.sendDecResource(heroKind,resourceIndex)
            }        
        }
    }

    private resetAccepts() {
        for (let i=0; i<this.involvedHeroes.length; i++) {
            let heroKind = this.involvedHeroes[i];
            if (heroKind != this.ownHeroKind) {
                this.heroAccepts.get(heroKind).setColor('#d11313');
            } else {
                this.heroAccepts.get(heroKind).setColor('#000000');
            }
        }
        this.numAccepts = 0;
        this.hasAccepted = false;
    }

    // TODO: COLLAB
    public disconnectListeners() {
        //MUST be called before deleting the window, or else it will bug when opened subsequently!
        //turn off any socket.on(...) that u add here!
    }
}