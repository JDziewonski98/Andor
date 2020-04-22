import { Window } from "./window";
import { WindowManager } from "../utils/WindowManager";
import { Hero } from '../objects/hero';
import { game } from '../api/game';
import { collabTextHeight, collabColWidth, collabRowHeight } from '../constants'
import { ResourceToggle } from "../widgets/ResourceToggle";
import BoardOverlay from "./boardoverlay";
import { HeroKind } from "../objects";
import { Scene, Game } from "phaser";

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
    private infight: boolean = false;

    private overlayRef: BoardOverlay;

    private name;

    
    private ownHeroKind: HeroKind
    private numAccepts
    private type
    private resourceToggles: Array<ResourceToggle>
    private heroMaxes
    private sumNeeded: number
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
        this.heroMaxes = data.heroMaxes
        //console.log(this.heroMaxes)
        this.sumNeeded = data.sumNeeded
        //console.log(this.involvedHeroes)
    }

    protected initialize() {
        var self = this

        // Set overlay not interactive: this doesn't work for start of game because elements of the
        // overlay may not be instantiated yet
        // this.overlayRef.toggleInteractive(false);

        // Initialize list of resource names
        if (this.resources) {
            Array.from(this.resources.keys()).forEach( key => {
                this.resourceNames.push(key);
            });
            //console.log(this.resourceNames);
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
            for(let hero of self.involvedHeroes){
                if(hero.getKind() == senderHeroKind){
                    involved = true
                }
            }
            if(self.ownHeroKind == senderHeroKind){
                involved = false
            }
            if(involved){
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
            for(let hero of self.involvedHeroes){
                if(hero.getKind() == senderHeroKind){
                    involved = true
                }
            }
            if(self.ownHeroKind == senderHeroKind){
                involved = false
            }
            if(involved){
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
            for(let hero of self.involvedHeroes){
                if(hero.getKind() == heroKind){
                    involved = true
                }
            }
            if(self.ownHeroKind == heroKind){
                involved = false
            }
            if(involved){
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
            backgroundColor: 'fxb09696',
            fontSize: collabTextHeight
        }
        
        // Done populating if this is just an accept window
        //if (!this.isOwner) {
            // this.acceptText = this.add.text(this.width/2, this.height-collabTextHeight, 'Accept', textStyle)

            // this.acceptText.setInteractive()
            // this.acceptText.on('pointerdown', function (pointer) {
            //     console.log("Current distribution", self.resAllocated);
            //     if (self.hasAccepted) {
            //         console.log("You have already accepted this decision");
            //         return;
            //     }
            //     self.acceptText.setText('Accepted!')
            //     self.acceptText.setColor('#d11313')
            //     self.gameinstance.collabDecisionAccept();
            // });

           //return;
        //}

        this.acceptText = this.add.text(0, this.height-collabTextHeight, 'Accept', textStyle)
        this.acceptText.setInteractive()
        this.acceptText.on('pointerdown', function (pointer) {
            if(!self.hasAccepted){
               // Check that resAllocated corresponds with specified quantities from data.resources
                if (self.verifyAllocated()) {
                    self.hasAccepted = true
                    self.acceptText.setColor('#00FF00')

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
                        for(let hero of self.involvedHeroes){
                            involvedHeroKinds.push(hero.getKind())
                        }
                        self.gameinstance.sendEndCollab(convMap, self.resourceNames, involvedHeroKinds)
                    }
                    //self.gameinstance.collabDecisionSubmit(convMap, self.resourceNames, self.involvedHeroes);
                    //
                } else {
                    console.log("Allocated quantities do not match those specified");
                    self.acceptText.setText("Quantities must match!")
                    self.acceptText.setColor('#d11313')
                    setTimeout(function(){
                        self.acceptText.setText("Accept");
                        self.acceptText.setColor('#FFFFFF')
                    }, 3000);
                } 
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
                    this.resourceToggles.push(new ResourceToggle(this, col*collabColWidth, (row+1)*collabRowHeight, 
                        heroKindString, col-1, this.resourceNames[col], this.resources.get(Array.from(this.resources.keys())[col-1]),this.resAllocated));
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

        //add hero images

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
            var total = 0
            for(let value of currTotals){
                total += value
            }
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
            var resMaxes = Array.from(this.resources.values());
            for (let i=0; i<resMaxes.length; i++) {
                if (resMaxes[i] != currTotals[i] && currTotals[i]!= 0) {
                    console.log("resource", i, "count did not match");
                    return false;
                }
            }
            return true;
        }
        else if(this.type == 'additive'){
            var self = this;
            var currTotals = [];
            currTotals.length = this.resources.size;
            currTotals.fill(0);
            Array.from(this.resAllocated.values()).forEach( counts => {
                for (let i=0; i<counts.length; i++) {
                    currTotals[i] += counts[i];
                }
            });
            console.log(currTotals)
            var sum = 0
            for (let i=0; i<currTotals.length; i++) {
               sum +=currTotals[i]
            }
            console.log(this.sumNeeded, sum)
            if(sum == this.sumNeeded){
                return true;
            }
            else{
                return false
            }
        }
        if(this.type == 'optionalDistribution'){
            var self = this;
            var currTotals = [];
            currTotals.length = this.resources.size;
            currTotals.fill(0);
            Array.from(this.resAllocated.values()).forEach( counts => {
                for (let i=0; i<counts.length; i++) {
                    currTotals[i] += counts[i];
                }
            });
            var resMaxes = Array.from(this.resources.values());
            for (let i=0; i<resMaxes.length; i++) {
                if (resMaxes[i] != currTotals[i] && currTotals[i] != 0) {
                    console.log("resource", i, "count did not match");
                    return false;
                }
            }
            return true;
        }
    }
    public incFunction(heroKind, resourceIndex){
        var rToggle
        var totalCount = 0
        var heroHasMore = true
        var resourceHasMore = true
        for(let rt of this.resourceToggles){
            if(rt.getResourceIndex() == resourceIndex){
               totalCount+=rt.getAmount()
            }     
            if(rt.getResourceIndex() == resourceIndex && heroKind == rt.getHeroKind() ){
                rToggle = rt
            }           
        }
        if(this.heroMaxes){
            let index = 0
            let i = 0
            for(let hero of this.involvedHeroes){
                if(hero.getKind() == heroKind){
                    index = i
                }
                i++
            }
            heroHasMore = totalCount < this.heroMaxes[index][resourceIndex]
        }
        if(this.type == "additive"){
            let sum = 0
            for(let rt of this.resourceToggles) {
                sum += rt.getAmount()
            }
            if(sum >= this.sumNeeded){
                resourceHasMore = false
            }
        }
        if(totalCount < this.resources.get(Array.from(this.resources.keys())[resourceIndex]) && heroHasMore && resourceHasMore){
            rToggle.incFunction()
            this.gameinstance.sendIncResource(heroKind,resourceIndex)
        }
    }
    public decFunction(heroKind, resourceIndex){
        for(let rt of this.resourceToggles){
            if(rt.getResourceIndex() == resourceIndex && heroKind == rt.getHeroKind()){
                if(rt.getAmount() == 0){
                    //do nothing
                }
                else{
                    rt.decFunction()
                    this.gameinstance.sendDecResource(heroKind,resourceIndex)
                }
            }        
        }
    }
}