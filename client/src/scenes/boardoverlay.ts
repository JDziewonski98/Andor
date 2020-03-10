import { Chat } from './chatwindow';
import { HeroWindow } from './herowindow';
import { WindowManager } from "../utils/WindowManager";
import { game } from '../api/game';
import { CollabWindow } from './collabwindow';

export default class BoardOverlay extends Phaser.Scene {
    private gameText;
    private gameinstance: game;

    constructor() {
        super({
            key: 'BoardOverlay'
        })
    }

    // BoardOverlay scene needs reference to the game controller so it can
    // create chat windows.
    public init(data) {
        console.log(data.gameinstance)
        this.gameinstance = data.gameinstance;
    }

    public preload() {
        this.load.image('hourbar', './assets/hours.PNG')
    }

    public create() {
        var self = this;

        var style2 = {
            fontFamily: '"Roboto Condensed"',
            fontSize: "20px",
            backgroundColor: '#f00'
        }

        // Your profile.
        this.gameText = this.add.text(400, 10, "You: 5g / 3 str / 8 will", style2)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            if (this.scene.isVisible('heroCard')) {
                WindowManager.destroy(this, 'heroCard');
            } else {
                console.log(self.gameinstance)
                WindowManager.create(this, 'heroCard', HeroWindow, self.gameinstance, { icon: 'weed' });
                let window = WindowManager.get(this, 'heroCard')
                window.setName('You!!')
            }
        }, this);

        //Other player's icons.
        this.gameText = this.add.text(360, 10, "P2", style2)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            if (this.scene.isVisible('heroCard2')) {
                WindowManager.destroy(this, 'heroCard2');
            } else {
                WindowManager.create(this, 'heroCard2', HeroWindow, self.gameinstance, { icon: 'playbutton' });
                let window = WindowManager.get(this, 'heroCard2')
                window.setName('Player 2')
            }
        }, this);

        this.gameText = this.add.text(330, 10, "P3", style2)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            if (this.scene.isVisible('heroCard3')) {
                WindowManager.destroy(this, 'heroCard3');
            } else {
                WindowManager.create(this, 'heroCard3', HeroWindow, self.gameinstance, { icon: 'playbutton' });
                let window = WindowManager.get(this, 'heroCard3')
                window.setName('Player 3')
            }
        }, this);

        this.gameText = this.add.text(300, 10, "P4", style2)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            if (this.scene.isVisible('heroCard4')) {
                WindowManager.destroy(this, 'heroCard4');
            } else {
                WindowManager.create(this, 'heroCard4', HeroWindow, self.gameinstance, { icon: 'playbutton' });
                let window = WindowManager.get(this, 'heroCard4')
                window.setName('Player 4')
            }
        }, this);

        //Options
        var optionsIcon = this.add.image(30, 30, 'optionsIcon').setInteractive();
        optionsIcon.setScale(0.5)
        optionsIcon.on('pointerdown', function (pointer) {
            this.sys.game.scene.bringToTop('Options')
            this.sys.game.scene.getScene('Options').scene.setVisible(true, 'Options')
            this.scene.resume('Options')
        }, this);

        // chat window
        this.gameText = this.add.text(800, 550, "CHAT", style2).setOrigin(0.5)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            if (this.scene.isVisible('chat')) {
                WindowManager.destroy(this, 'chat');
            }
            else {
                WindowManager.create(this, 'chat', Chat, { gameinstance: self.gameinstance }, null);
            }
        }, this);

        // collab decision mock
        this.gameText = this.add.text(600, 550, "COLLAB", style2).setOrigin(0.5)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            if (this.scene.isVisible('collab')) {
                WindowManager.destroy(this, 'collab');
            }
            else {
                //remember to revert this to how gameinstance was being passed before
                WindowManager.create(this, 'collab', CollabWindow, self.gameinstance, null);
            }
        }, this);

    }
}