import {
   borderWidth, scaleFactor,
  } from '../constants'

export class EventCard extends Phaser.GameObjects.Text {
    flavorText: String
    desc: String
    

    //ideally, front end has all event cards mapped by id but for now
    constructor(scene, flavorText, text) {
        //scene.load.image('weed', './assets/8bit_herb.jpeg')
        //var weed = scene.add.sprite(85, 190, 'weed').setDisplaySize(40, 40)
        super(scene, 2753 * scaleFactor + borderWidth, 377 * scaleFactor + borderWidth, flavorText + "\n" + text, null);
        this.desc = text
        //super(scene, 200, 200, 'weed');
        //this.id = id;
        
        //this.setDisplaySize(100,100)
        //console.log("muthafuckka")
        this.setInteractive()
        this.on('pointerdown', function () {
            // this.destroy()
            //this.text.destroy()
            scene.addEventCard(1, "NEWWWWW CARDDDDDDDD")
            //this.removeFromScene()
        }
        )
        console.log(this)
    }

    // public removeFromScene(){
    //     //this.text.destroy()
    //     this.destroy()
        
    // }
} 