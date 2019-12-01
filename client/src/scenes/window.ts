import * as Phaser from 'phaser';
export class Window extends Phaser.Scene {
    private parent
    private function: string;
    private exists: boolean = false
    public static window: Window
    private constructor (handle, parent, funct)
    {
        super(handle);
        this.parent = parent;
        this.function = funct
    }

    public static getInstance(handle, parent, funct): Window {
        if (!Window.window) {
            Window.window = new Window(handle, parent, funct)
        }
        return this.window
    }

    create ()
    {
        this.add.text(1,2,'You',{backgroundColor: '0xf00'})
        //can switch on the type of window we need to generate
        switch(this.function) {
            case 'herowindow':
                this.herowindow()
            default:
                break
        }
        this.cameras.main.setViewport(this.parent.x, this.parent.y, 300, 200);
        this.input.keyboard.on('keydown_ESC',this.kill,this)
        this.cameras.main.setBackgroundColor("6E8C97")
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

    herowindow(){
        this.add.sprite(50, 50, 'weed').setOrigin(0.5);
        this.add.text(50,100,'Gold: 5',{backgroundColor: 'fx00'})
        this.add.text(50,120,'Willpower: 7',{backgroundColor: 'fx00'})
        this.add.text(50,140,'Strength: 7',{backgroundColor: 'fx00'})
        this.add.text(100,10,'Special Class\nAbility Stuff',{backgroundColor: 'fx00'})
    }
}