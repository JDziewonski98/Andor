import { Window } from "./window";
export class HeroWindow extends Window {
    public constructor (key, windowData={x:350, y:30, width: 350, height: 150}){
        super(key, windowData);
    }


    protected initialize(){
        console.log("hero window", this)
        this.cameras.main.setBackgroundColor('0xa4sd44')
        this.add.sprite(50, 50, 'weed').setOrigin(0.5);
        this.add.text(50,100,'Gold: 5',{backgroundColor: 'fx00'})
        this.add.text(50,120,'Willpower: 7',{backgroundColor: 'fx00'})
        this.add.text(150,50,'Special ability text ....',{backgroundColor: 'fx00'})
        this.add.text(150,70,'Items ....',{backgroundColor: 'fx00'})
    }

}