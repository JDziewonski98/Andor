import { game } from "../api";
import { WindowManager } from "../utils/WindowManager";
import { Chat } from './chatwindow';
import { GameObjects } from "phaser";

export default class ReadyScreenScene extends Phaser.Scene {
    public archer: GameObjects.Image;
    public warrior: GameObjects.Image;
    public dwarf: GameObjects.Image;
    public mage: GameObjects.Image;
    public selection: GameObjects.Sprite;
    public ready: boolean = false;
    public playbutton: GameObjects.Sprite;
    public readytext: GameObjects.Text;
    public gameController: game;
    private chatText: GameObjects.Text;
    public name: string;

    constructor() {
        super({ key: 'Ready' });
    }

    public init(data) {
        this.name = data.name;
        this.gameController = new game(this.name);

    }

    public preload() {
        this.load.html('readyform', './assets/readyscreen.html')
        this.load.html('readytable', './assets/readytable.html')

        this.load.image("archer", "../assets/archermale.png");
        this.load.image("dwarf", "./assets/dwarfmale.png");
        this.load.image("warrior", "./assets/warriormale.png");
        this.load.image("mage", "./assets/magemale.png");
    }

    create() {
        const heroSize = {
            x: 160,
            y: 200
        }

        this.add.image(500, 300, 'andordude').setDisplaySize(1000, 600)
        this.archer = this.add.image(200, 200, 'archer').setDisplaySize(heroSize.x, heroSize.y)
        this.add.text(176, 320, "Archer");
        this.archer.name = "archer";
        this.attachHeroBinding(this.archer);

        this.dwarf = this.add.image(410, 200, 'dwarf').setDisplaySize(heroSize.x, heroSize.y)
        this.add.text(385, 320, "Dwarf");
        this.dwarf.name = "dwarf";
        this.attachHeroBinding(this.dwarf);

        this.warrior = this.add.image(620, 200, 'warrior').setDisplaySize(heroSize.x, heroSize.y)
        this.add.text(595, 320, "Warrior");
        this.warrior.name = "warrior";
        this.attachHeroBinding(this.warrior);

        this.mage = this.add.image(830, 200, 'mage').setDisplaySize(heroSize.x, heroSize.y)
        this.add.text(805, 320, "Mage");
        this.mage.name = "mage";
        this.attachHeroBinding(this.mage);

        this.selection = this.add.sprite(200, 70, 'backbutton').setDisplaySize(48, 48)
        this.selection.angle = 90
        this.readytext = this.add.text(200, 450, 'Ready?', { fontFamily: '"Roboto Condensed"', fontSize: "40px", color: "#E42168" })

        // back button
        var backbutton = this.add.sprite(50, 550, 'backbutton').setInteractive()
        backbutton.flipX = true
        backbutton.on('pointerdown', function (pointer) {
            this.scene.start('Lobby');

        }, this);

        var self = this;

        //advance to game button.
        this.playbutton = this.add.sprite(950, 550, 'playbutton').setInteractive()
        this.playbutton.on('pointerdown', function (pointer) {
            self.gameController.allPlayersReady((ready) => {
                if (this.ready && ready) {
                    if (this.scene.isVisible('chat')) {
                        WindowManager.destroy(this, 'chat');
                    }
                    this.scene.start('Game', { controller: self.gameController, heroType: self.selection.name });
                }
                else {
                    this.tween()
                }
            })

        }, this);

        // chat window
        WindowManager.create(this, 'chat', Chat, { controller: self.gameController });
        this.chatText = this.add.text(800, 550, "CHAT").setOrigin(0.5)
        this.chatText.setInteractive();
        this.chatText.on('pointerdown', function (pointer) {
            if (this.scene.isVisible('chat')) {
                WindowManager.destroy(this, "chat")
            }
            else {
                WindowManager.create(this, "chat", Chat, { controller: self.gameController })
            }

        }, this);
        WindowManager.destroy(this, "chat")

        function updateTints(heros) {
            heros.taken.forEach(hero => {
                self[hero].setTint(0x404040)
                self.gameController.removeListener(hero)
            });
            heros.remaining.forEach(hero => {
                self[hero].setTint()
            })
        }

        this.gameController.updateHeroList(updateTints); // listener for when other clients select heros
        this.gameController.getBoundHeros(updateTints); // initialize the list of hero tints correctly

        //callbacks
        function remListener(hero) {
            self[hero].removeListener('pointerdown')
        }
        

        this.gameController.removeObjListener(remListener)
    }

    private attachHeroBinding(item) {
        item.setInteractive();
        var self = this;
        item.on('pointerdown', function () {
            if (!self.ready) {
                self.gameController.bindHeroForSelf(item.name, function (heros) {
                    self.selection.x = item.x;
                    self.ready = true;
                    self.selection.name = item.name;
                    heros.taken.forEach(hero => {
                        self[hero].setTint(0x404040)
                    });
                    heros.remaining.forEach(hero => {
                        self[hero].setTint()
                    })
                })
            }

        });

    }


    public tween() {
        //  Flash the prompt
        this.tweens.add({
            targets: this.readytext,
            alpha: 0.2,
            duration: 200,
            ease: 'Power3',
            yoyo: true
        });
    }

}