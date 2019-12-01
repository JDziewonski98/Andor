import * as Phaser from 'phaser';
export abstract class Window extends Phaser.Scene {
    private parent: Phaser.GameObjects.Zone
    protected windowData;
    public constructor (key, windowData={}){
        super(key);
        this.windowData = windowData;
    }


    create () {
        this.parent = this.add.zone(this.windowData.x, this.windowData.y, this.windowData.length, this.windowData.width).setInteractive().setOrigin(0);
        this.parent.on('drag', function (pointer, dragX, dragY) {
            this.x = dragX;
            this.y = dragY;
            // demo.refresh()
        });
        var bg = this.add.image(0, 0, 'beach');
        this.add.text(1,2,'drag me hoe',{backgroundColor: '0xf00'})
        //can switch on the type of window we need to generate
        this.initialize()
        this.cameras.main.setViewport(this.parent.x, this.parent.y, 400, 200);
        this.input.keyboard.on('keydown_ESC',this.kill,this)
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);

        this.scene.bringToTop();

    }

    //press ESC to close windows
    kill()
    {
        try{
        this.scene.stop()
        this.scene.sendToBack()
        //this.scene.remove()
        }
        catch(e){
            console.log('something went wrong')
        }
    }

    public revive() {
        this.scene.start()
        this.scene.bringToTop()
    }

    protected abstract initialize(): void;
    
}