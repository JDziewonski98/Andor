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
    public constructor(scene, x, y, heroKind: string, resourceIndex: number, resourceName: string, maxAmount: number, allocated: Map<string, number[]>) {
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

        this.collabWindow = scene
        let self = this
        this.incButton.on('pointerdown', function (pointer) {
            self.incFunctionRequest()
        }, this);
        this.decButton.on('pointerdown', function (pointer) {
            self.decFunctionRequest()
        }, this);
        console.log(this)
    }
    public incFunctionRequest(){
        this.collabWindow.incFunction(this.heroKind,this.resourceIndex,this.resourceName)
    }
    public decFunctionRequest(){
        this.collabWindow.decFunction(this.heroKind,this.resourceIndex)
    }
    public incFunction(){
        
        this.amount++;
        this.allocated.get(this.heroKind)[this.resourceIndex] = this.amount;
        var x = this.amountText.x
        var y = this.amountText.y
        this.amountText.destroy()
        this.amountText = this.collabWindow.add.text(x, y, this.amount);
    }
    public decFunction(){
        this.amount--;
        this.allocated.get(this.heroKind)[this.resourceIndex] = this.amount;
        var x = this.amountText.x
        var y = this.amountText.y
        this.amountText.destroy()
        this.amountText = this.collabWindow.add.text(x, y, this.amount);
    }
    
    public getResourceIndex(){
        return this.resourceIndex
    }
    public getHeroKind(){
        return this.heroKind
    }
    public getAmount(){
        return this.amount
    }
    public getResourceName(){
        return this.resourceName
    }
}