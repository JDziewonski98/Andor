import { lobby } from "../api";
import { reducedWidth, reducedHeight } from '../constants'

export default class LobbyScene extends Phaser.Scene {
    private welcomeText;
    private gameText;
    private optionsIcon;
    private scaleRatio = window.devicePixelRatio / 3;
    private lobbyController;

    constructor() {
        super({
            key: 'Lobby',
            active: true
        });
        this.lobbyController = new lobby();
    }

    public init(data) {

    }

    public preload() {
        // Load all game assets in first scene
        this.load.image('desert', './assets/fantasydesert.jpg')
        this.load.image('mountains', './assets/mountains_bg.jpg')
        this.load.image('andordude', './assets/andordude.jpg')
        this.load.image('gameboard', './assets/Andor_Board.jpg')
        this.load.image('pointerbtn', './assets/Pass.png')
        this.load.image('playbutton', './assets/Play.png')
        this.load.image('warriormale', './assets/warriormale.png')
        this.load.image('magemale', './assets/magemale.png')
        this.load.image('dwarfmale', './assets/dwarfmale.png')
        this.load.image('archermale', './assets/archermale.png')
        this.load.image('fantasyhome', './assets/fantasyhome.jpg')
        this.load.image('optionsIcon', './assets/haus.png')
        this.load.image('scrollbg', './assets/windowbg.jpg')
        this.load.image('trademenubg', './assets/menubackground.png')
        this.load.image('main', './assets/mainscreen.png')
        this.load.image('goback', './assets/wizard-goes-back.png')
        this.load.image('entergame', './assets/enter.png')
    }

    public create() {
        // Scale the game size to the original screen size of pre-game-entry
        // scenes (lobby, load, join, etc). This has the effect of keeping desired
        // behaviour of Phaser Game autoscaling, while keeping the actual game size
        // larger.
        this.scale.setGameSize(reducedWidth, reducedHeight);

        this.draw()

        this.lobbyController.addNewPlayerToLobby()
    }

    private draw() {
        // load background
        var bg = this.add.image(500, 300, 'main').setDisplaySize(1000, 600)

        // menuText for menu text
        var menuText = {
            fontFamily: "Roboto Condensed",
            fontSize: "40px",
            fontStyle: "italic"
        }
        var housetText= {
            fontFamily: "Roboto Condensed",
            fontSize: "20px",
            fontStyle: "italic",
            color: "gray"
        }

        var self = this;
        this.gameText = this.add.text(500, 300, "New", menuText).setOrigin(0.5)
        this.gameText.setShadow(0, 0, 'black', 10);
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.start('Create', { controller: self.lobbyController });
        }, this);

        this.gameText = this.add.text(500, 400, "Join", menuText).setOrigin(0.5)
        this.gameText.setShadow(0, 0, 'black', 10);

        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.start('Join', { controller: self.lobbyController });
        }, this);

        this.gameText = this.add.text(500, 500, "Load", menuText).setOrigin(0.5)
        this.gameText.setShadow(0, 0, 'black', 10);

        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.start('Load', { controller: self.lobbyController });
        }, this);

        this.optionsIcon = this.add.image(900, 80, 'optionsIcon').setInteractive().setScale(0.3);
        this.add.text(900, 133, "heroes' dwelling", housetText).setOrigin(0.5)
        this.optionsIcon.on('pointerdown', function (pointer) {
            this.scene.bringToTop('Options')
            this.scene.wake('Options')
        }, this);
    }

    public update() {

    }

    // Currently unused
    static setCameraViewport(currScene) {
        var camera = currScene.cameras.main;
        camera.setViewport(0, 0, 1000, 600);
    }
}