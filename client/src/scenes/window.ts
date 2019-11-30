import * as Phaser from 'phaser';
export class Window extends Phaser.Scene {
    private parent
    private function: string;
    constructor (handle, parent, funct)
    {
        super(handle);
        this.parent = parent;
        this.function = funct
    }

    create ()
    {
        var bg = this.add.image(0, 0, 'beach');
        this.add.text(1,2,'drag me hoe',{backgroundColor: '0xf00'})
        switch(this.function) {
            case 'herowindow':
                this.herowindow()
            default:
                break
        }
        this.cameras.main.setViewport(this.parent.x, this.parent.y, 200, 200);
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);

        this.scene.bringToTop();
    }

    kill()
    {
        this.scene.remove()
    }

    herowindow(){
        this.add.sprite(50, 50, 'weed').setOrigin(0.5);
        this.add.text(50,100,'Gold: 5',{backgroundColor: 'fx00'})
        this.add.text(50,120,'Willpower: 7',{backgroundColor: 'fx00'})
    }

}