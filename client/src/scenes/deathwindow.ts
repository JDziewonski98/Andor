import { Window } from "./window";
import { game } from '../api/game';
import { WindowManager } from "../utils/WindowManager";
import { CollabWindow } from './collabwindow';

export class DeathWindow extends Window {
    private gameinstance
    private windowname

    public constructor(key: string, data, windowData = { x: 350, y: 30, width: 400, height: 250 }) {
        super(key, windowData);
        this.gameinstance = data.controller
        this.windowname = key
    }

    protected initialize() {
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        bg.tint = 0xff0000
        this.add.text(25,25,'You died.\nStrength reduced by 1.\nWill reset to 3.')
        var okbutton = this.add.text(100,200, 'Click to confirm').setInteractive()
        okbutton.on('pointerdown', function(pointer) {
            self.scene.remove(self.windowname)
        })
    }

}