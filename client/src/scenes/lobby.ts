// import { game } from "../main";
import LoadGameScene from "./loadgame";
import Options from "./options";
import AndorGame from "../main";
import { andorGame } from "../main";

export default class LobbyScene extends Phaser.Scene {
    private welcomeText;
    private weedText;
    private gameText;
    private soundOff;
    private soundOn;
    private optionsIcon;
    private scaleRatio = window.devicePixelRatio / 3;
    private model;
    constructor() {
        super({ 
            key: 'Lobby',
            active: true
        });
    }

    public preload() {
        this.load.image('beach', './assets/swamp.jpg');
        this.load.image('map', './assets/andor_map.jpg');
        this.load.image('weed', './assets/8bit_herb.jpeg')
        this.load.image('desert', './assets/fantasydesert.jpg')
        this.load.image('mountains', './assets/mountains_bg.jpg')
        this.load.image('andordude', './assets/andordude.jpg')
        this.load.image('backbutton', './assets/Pass.png')
        this.load.image('playbutton', './assets/Play.png')
        this.load.image('warriormale', './assets/warriormale.png')
        this.load.image('magemale', './assets/magemale.png')
        this.load.image('dwarfmale', './assets/dwarfmale.png')
        this.load.image('archermale', './assets/archermale.png')
        this.load.image('hourbar', './assets/hours.PNG')
        this.load.image('fantasyhome','./assets/fantasyhome.jpg')

        // Music
        this.load.audio('music', 'assets/doxent_-_Arcane.mp3')
        this.load.image('optionsIcon', './assets/icons/settings_icon.png')
        // this.load.image('soundon','./assets/SongOn.png')
        // this.load.image('soundoff','./assets/SongOff.png')
    }

    public create() {
        // let andorGame = this.sys.game as AndorGame

        var bg = this.add.image(500, 300, 'beach').setDisplaySize(1000,600)
        var style1 = {
            fontFamily: '"Roboto Condensed"',
            fontSize: "70px",
            shadow: {
                offsetX: 5,
                offsetY: 5,
                color: '#000',
                blur: 10,
                stroke: true,
                fill: true
            },
            color: "#4944A4"
        }
        this.welcomeText = this.add.text(500, 200, "Welcome to Andor", style1).setOrigin(0.5)

        var style2 = {
            fontFamily: '"Roboto Condensed"',
            fontSize: "40px",
            backgroundColor: "#f00"
        }
        this.weedText = this.add.text(500, 300, "New", style2).setOrigin(0.5)
        this.weedText.setInteractive();
        this.weedText.on('pointerdown', function (pointer) {
            this.scene.start('Create');
        }, this);

        this.gameText = this.add.text(500, 400, "Join", style2).setOrigin(0.5)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.start('Join');
        }, this);

        this.gameText = this.add.text(500, 500, "Load", style2).setOrigin(0.5)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.start('Load');
        }, this); 

        // Adding music to the game
        // let music = this.game.sound.add('music')
        // music.play({
        //     loop: true,
        //     volume: 0.6
        // })
        // music.pause()

        this.optionsIcon = this.add.image(930, 80, 'optionsIcon').setInteractive();
        this.optionsIcon.on('pointerdown', function (pointer) {
            this.sys.game.scene.bringToTop('Options')
        }, this);

        this.model = andorGame.globals.model;
        if (this.model.musicOn === true) {
            let bgMusic = this.sound.add('music', { volume: 0.5, loop: true });
            bgMusic.play();
        }
    }

    public update() {

    }
}