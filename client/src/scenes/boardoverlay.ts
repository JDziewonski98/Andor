import { Chat } from './chatwindow';
import { HeroWindow } from './herowindow';
import { WindowManager } from "../utils/WindowManager";
import { game } from '../api/game';
import { CollabWindow } from './collabwindow';
//import { dropgoldwindow } from './dropgoldwindow';

export default class BoardOverlay extends Phaser.Scene {
    private gameText;
    private gameinstance: game;
    private endturntext;
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
        
        this.gameinstance.getHeros((heros) =>{
            heros.forEach(type => {
                if (type === "mage") {
                  // Your profile.
                    this.gameText = this.add.text(400, 10, "Mage", style2)
                    this.gameText.setInteractive();
                    this.gameText.on('pointerdown', function (pointer) {

                    this.gameinstance.getHeroAttributes("Mage", (herodata) => {
                    
                        if (this.scene.isVisible('mageCard')) {
                            WindowManager.destroy(this, 'mageCard');
                        } else {
                            console.log(self.gameinstance)
                            WindowManager.create(this, 'mageCard', HeroWindow,{controller: self.gameinstance, icon: 'weed', ...herodata});
                            let window = WindowManager.get(this, 'mageCard')
                            window.setName('Mage')
                        }
                    })

                    }, this);
                }else if (type === "archer") {
                  //Other player's icons.
                    this.gameText = this.add.text(300, 10, "Archer", style2)
                    this.gameText.setInteractive();
                    this.gameText.on('pointerdown', function (pointer) {
                        this.gameinstance.getHeroAttributes("Archer", (herodata) => {
                    
                            if (this.scene.isVisible('archerCard')) {
                                WindowManager.destroy(this, 'archerCard');
                            } else {
                                console.log(self.gameinstance)
                                WindowManager.create(this, 'archerCard', HeroWindow,{controller: self.gameinstance, icon: 'weed', ...herodata});
                                let window = WindowManager.get(this, 'archerCard')
                                window.setName('Archer')
                            }
                        })
                    }, this);
                } else if (type === "warrior") {
                    this.gameText = this.add.text(200, 10, "Warrior", style2)
                    this.gameText.setInteractive();
                    this.gameText.on('pointerdown', function (pointer) {
                        this.gameinstance.getHeroAttributes("Warrior", (herodata) => {
                    
                            if (this.scene.isVisible('warriorCard')) {
                                WindowManager.destroy(this, 'warriorCard');
                            } else {
                                console.log(self.gameinstance)
                                WindowManager.create(this, 'warriorCard', HeroWindow,{controller: self.gameinstance, icon: 'weed', ...herodata});
                                let window = WindowManager.get(this, 'warriorCard')
                                window.setName('Warrior')
                            }
                        })
                    }, this);
                } else if (type === "dwarf") {
                    this.gameText = this.add.text(100, 10, "Dwarf", style2)
                    this.gameText.setInteractive();
                    this.gameText.on('pointerdown', function (pointer) {
                        this.gameinstance.getHeroAttributes("Dwarf", (herodata) => {
                    
                            if (this.scene.isVisible('dwarfCard')) {
                                WindowManager.destroy(this, 'dwarfCard');
                            } else {
                                console.log(self.gameinstance)
                                WindowManager.create(this, 'dwarfCard', HeroWindow, {controller: self.gameinstance, icon: 'weed', ...herodata});
                                let window = WindowManager.get(this, 'dwarfCard')
                                window.setName('Dwarf')
                            }
                        })
                    }, this);
                }
              });
        })

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
            console.log(this.scene, ' in overlay')
            if (this.scene.isVisible('chat')) {
                WindowManager.destroy(this, 'chat');
            }
            else {
                WindowManager.create(this, 'chat', Chat, { gameinstance: self.gameinstance });
            }
        }, this);

        // end turn button
        this.endturntext = this.add.text(900, 550, "END TURN", style2).setOrigin(0.5)
        this.endturntext.setInteractive();
        this.endturntext.on('pointerdown', function (pointer){
            if (this.gameinstance.myTurn) {
                this.gameinstance.endTurn();
                this.tweens.add({
                    targets: this.endturntext,
                    alpha: 0.3,
                    duration: 350,
                    ease: 'Power3',
                    yoyo: true
                });
        
            }
        }, this)
    }
}