export class ResourceToggle {
    private heroKind: string;
    private resourceIndex: number;
    private maxAmount: number;
    private allocated: Map<string, number[]>;

    private amountText;
    private amount = 0;
    private incButton;
    private decButton;

    public constructor(scene, x, y, heroKind: string, resourceIndex: number, maxAmount: number, allocated: Map<string, number[]>) {
        this.heroKind = heroKind;
        this.resourceIndex = resourceIndex;
        this.maxAmount = maxAmount;
        this.allocated = allocated;

        this.amountText = scene.add.text(x, y, this.amount);
        this.incButton = scene.add.sprite(x+30, y, 'backbutton').setDisplaySize(15, 15).setInteractive();
        this.incButton.angle = 270;
        this.decButton = scene.add.sprite(x+30, y+15, 'backbutton').setDisplaySize(15, 15).setInteractive();
        this.decButton.angle = 90;

        this.incButton.on('pointerdown', function (pointer) {
            if (this.amount == maxAmount) {
                console.log("Already max allocatable amount");
                return;
            }
            this.amount++;
            this.allocated.get(heroKind)[resourceIndex] = this.amount;
            this.amountText.setText(this.amount);
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
}