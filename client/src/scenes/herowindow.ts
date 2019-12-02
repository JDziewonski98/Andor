import { Window } from "./window";
export class HeroWindow extends Window {
    public constructor (key, windowData={}){
        super(key, windowData);
    }


    protected initialize(){
        if(Object.keys(this.windowData).length === 0){ // no data provided, put preset data instead

        } else {
            this.add.sprite(50, 50, 'weed').setOrigin(0.5);
            this.add.text(50,100,'Gold: 5',{backgroundColor: 'fx00'})
            this.add.text(50,120,'Willpower: 7',{backgroundColor: 'fx00'})
        }

    }

}