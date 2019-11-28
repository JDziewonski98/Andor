import * as Phaser from 'phaser';
export class Window extends Phaser.Scene {
    private parent
    constructor (handle, parent)
    {
        super(handle);
        this.parent = parent;
    }

    create ()
    {
        var bg = this.add.image(0, 0, 'beach').setOrigin(0);

        this.cameras.main.setViewport(this.parent.x, this.parent.y, 100, 100);

        this.add.sprite(50, 50, 'weed').setOrigin(0.5);
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);

        this.scene.bringToTop();
    }

}