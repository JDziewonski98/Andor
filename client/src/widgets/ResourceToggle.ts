import { game } from '../api/game';
import { Hero } from '../objects/hero'
export class ResourceToggle {
    private heroKind: string;
    private resourceIndex: number;
    private resourceName: String;
    private maxAmount: number;
    private allocated: Map<string, number[]>;

    private amountText;
    private amount = 0;
    private incButton;
    private decButton;

    private collabWindow;
    public constructor(scene, x, y, heroKind: string, resourceIndex: number, resourceName: String, maxAmount: number, allocated: Map<string, number[]>) {
        this.heroKind = heroKind;
        this.resourceIndex = resourceIndex;
        this.maxAmount = maxAmount;
        this.allocated = allocated;

        //this.resourceName = resourceName

        this.amountText = scene.add.text(x, y, this.amount);
        this.amountText.setActive(true)
        this.incButton = scene.add.sprite(x+30, y, 'pointerbtn').setDisplaySize(15, 15).setInteractive();
        this.incButton.angle = 270;
        this.decButton = scene.add.sprite(x+30, y+15, 'pointerbtn').setDisplaySize(15, 15).setInteractive();
        this.decButton.angle = 90;

        // this.involvedHeroes = involvedHeroes
        // this.gameinstance = gameinstance
        this.collabWindow = scene
        // this.collabWindow.gameinstance.incListener((resourceHeroKind, resourceIndex, senderHeroKind) =>{
        //     console.log("Recieved: receiveIncResource", resourceHeroKind, resourceIndex, senderHeroKind)
        //     var involved = false
        //     for(let hero of this.collabWindow.involvedHeroes){
        //         if(hero.getKind() == senderHeroKind){
        //             involved = true
        //         }
        //     }
        //     console.log(involved)
        //     if(involved){
        //         if(this.heroKind == resourceHeroKind && this.resourceIndex == resourceIndex){
        //             this.amount++;
        //             this.allocated.get(this.heroKind)[this.resourceIndex] = this.amount;
        //             this.amountText.setText(this.amount);
        //         }
        //     }
        // })
        let self = this
        this.incButton.on('pointerdown', function (pointer) {
            self.incFunctionRequest()
        }, this);
        this.decButton.on('pointerdown', function (pointer) {
            if (this.amount == 0) {
                console.log("Already min allocatable amount");
                return;
            }
            this.amount--;
            this.allocated.get(heroKind)[resourceIndex] = this.amount;
            this.amountText.setText(this.amount);
        }, this);
    }
    public incFunctionRequest(){
        this.collabWindow.incFunction(this.heroKind,this.resourceIndex)
    }
    public incFunction(){
        console.log("called incFunction")
        console.log(this.amount, this.amountText)
        this.amount++;
        this.allocated.get(this.heroKind)[this.resourceIndex] = this.amount;
        var x = this.amountText.x
        var y = this.amountText.y
        this.amountText.destroy()
        this.amountText = this.collabWindow.add.text(x, y, this.amount);
        this.amountText.updateText()
        
        
        //this.amountText.setText(this.amount);
        console.log(this.amount, this.amountText.text)
        //this.collabWindow.gameinstance.sendIncResource(this.heroKind,this.resourceIndex)
        //this.collabWindow.incFunction(heroKind,resourceIndex)
    }
    // public incListenerCallback(resourceHeroKind, resourceIndex, senderHeroKind, resourceToggle){
    //     var involved = false
    //     for(let hero of this.collabWindow.involvedHeroes){
    //         if(hero.getHeroKind() == senderHeroKind){
    //             involved = true
    //         }
    //     }
    //     if(involved){
    //         if(this.heroKind == resourceHeroKind && this.resourceIndex == resourceIndex){
    //             this.amount++;
    //             this.allocated.get(this.heroKind)[this.resourceIndex] = this.amount;
    //             this.amountText.setText(this.amount);
    //         }
    //     }
    // }
    public getResourceIndex(){
        return this.resourceIndex
    }
    public getHeroKind(){
        return this.heroKind
    }
}