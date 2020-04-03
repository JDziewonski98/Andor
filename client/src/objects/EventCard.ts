import {
   borderWidth, scaleFactor,
  } from '../constants'

export class EventCard extends Phaser.GameObjects.Text {
    id: Number
    flavorText: String
    desc: String

    constructor(scene, id, flavorText, text) {
        super(scene, 2753 * scaleFactor + borderWidth, 377 * scaleFactor + borderWidth, flavorText + "\n" + text, null);
        this.id = id
        this.flavorText = flavorText
        this.desc = text
        console.log("New event created: ", this)
    }

} 