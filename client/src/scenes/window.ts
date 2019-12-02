import * as Phaser from 'phaser';
export abstract class Window extends Phaser.Scene {
    private parent: Phaser.GameObjects.Zone
    protected windowData;
    public constructor (key, windowData={}){
        super(key);
        this.windowData = windowData;
    }

    create () {
        console.log("parent window create", this.windowData)
        this.parent = this.add.zone(this.windowData.x, this.windowData.y, this.windowData.width, this.windowData.height).setInteractive().setOrigin(0);
        this.parent.on('drag', function (pointer, dragX, dragY) {
            this.x = dragX;
            this.y = dragY;
            // demo.refresh()
        });
        this.initialize()
        this.cameras.main.setViewport(this.parent.x, this.parent.y, this.windowData.width, this.windowData.height);
        // this.input.keyboard.on('keydown_ESC',this.kill,this)
        // this.cameras.main.setBackgroundColor("6E8C97")
    }

    //press ESC to close windows
    kill()
    {
        try{
        this.scene.stop()
        // this.scene.sendToBack()
        //this.scene.remove()
        }
        catch(e){
            console.log('something went wrong')
        }
    }

    protected abstract initialize(): void;
    
}