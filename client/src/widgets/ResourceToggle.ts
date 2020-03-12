export class ResourceToggle {
    private heroKind: string;
    private resourceIndex: number;
    private allocated;

    private amountText;
    private amount = 0;
    private incButton;
    private decButton;

    public constructor(scene, x, y, heroKind: string, resourceIndex: number, allocated) {
        this.heroKind = heroKind;
        this.resourceIndex = resourceIndex;
        this.allocated = allocated;

        this.amountText = scene.add.text(x, y, this.amount);
        this.incButton = scene.add.sprite(x+30, y, 'backbutton').setDisplaySize(15, 15).setInteractive();
        this.incButton.angle = 270;
        this.decButton = scene.add.sprite(x+30, y+15, 'backbutton').setDisplaySize(15, 15).setInteractive();
        this.decButton.angle = 90;

        this.incButton.on('pointerdown', function (pointer) {
            this.amount++;
            this.allocated[heroKind][resourceIndex] = this.amount;
            this.amountText.setText(this.amount);
        }, this);
        this.decButton.on('pointerdown', function (pointer) {
            this.amount--;
            this.allocated[heroKind][resourceIndex] = this.amount;
            this.amountText.setText(this.amount);
        }, this);
    }
}