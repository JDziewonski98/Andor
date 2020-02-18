import { Window } from "./window";
export class HeroWindow extends Window {
    public constructor (key, windowData={x:350, y:30, width: 350, height: 150}){
        super(key, windowData);
    }

 
    protected initialize(){
        console.log("hero window", this)
        this.cameras.main.setBackgroundColor('0xa4sd44')
        var bg = this.add.image(0,0,'scrollbg').setOrigin(0.5)
        var weed = this.add.sprite(50, 50, 'weed');
        this.add.text(50,100,'Gold: 5',{backgroundColor: 'fx00'})
        this.add.text(50,120,'Willpower: 7',{backgroundColor: 'fx00'})
        this.add.text(150,50,'Special ability text ....',{backgroundColor: 'fx00'})
        this.add.text(150,70,'Items ....',{backgroundColor: 'fx00'})
        // weed.setInteractive()
        // this.input.setDraggable(weed)
        bg.setInteractive()
        this.input.setDraggable(bg)
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
    }

}