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
        this.load.image('desert', './assets/pregame-components/fantasydesert.jpg')
        this.load.image('mountains', './assets/pregame-components/mountains_bg.jpg')
        this.load.image('andordude', './assets/pregame-components/andordude.jpg')
        this.load.image('main', './assets/pregame-components/mainscreen.png')
        this.load.image('goback', './assets/pregame-components/wizard-goes-back.png')
        this.load.image('entergame', './assets/pregame-components/enter.png')
        this.load.image('fantasyhome', './assets/pregame-components/fantasyhome.jpg')

        this.load.image('gameboard', './assets/board-major/Andor_Board.jpg')
        this.load.image('pointerbtn', './assets/Pass.png')
        // this.load.image('playbutton', './assets/Play.png')

        this.load.image("archermale", "../assets/pregame-components/archermale.png");
        this.load.image("dwarfmale", "./assets/pregame-components/dwarfmale.png");
        this.load.image("warriormale", "./assets/pregame-components/warriormale.png");
        this.load.image("magemale", "./assets/pregame-components/magemale.png");
        this.load.image("archer", "../assets/pregame-components/archermale.png");
        this.load.image("dwarf", "./assets/pregame-components/dwarfmale.png");
        this.load.image("warrior", "./assets/pregame-components/warriormale.png");
        this.load.image("mage", "./assets/pregame-components/magemale.png");

        this.load.image('optionsicon', './assets/options-menu/haus.png')
        this.load.image('scrollbg', './assets/windowbg.jpg')
        this.load.image('trademenubg', './assets/menubackground.png')
    }

    public create() {
        // Scale the game size to the original screen size of pre-game-entry
        // scenes (lobby, load, join, etc). This has the effect of keeping desired
        // behaviour of Phaser Game autoscaling, while keeping the actual game size
        // larger.
        this.scale.setGameSize(reducedWidth, reducedHeight);

        this.makeMenuButtons()

        this.lobbyController.addNewPlayerToLobby()
    }

    private makeMenuButtons() {
        // load background
        var bg = this.add.image(500, 300, 'main').setDisplaySize(1000, 600)

        // menuText for menu text
        var menuText = {
            fontFamily: "Roboto Condensed",
            fontSize: "40px",
            fontStyle: "italic"
        }
        var housetText = {
            fontFamily: "Roboto Condensed",
            fontSize: "20px",
            fontStyle: "italic",
            color: "gray"
        }

        var self = this;
        // NEW BUTTON
        this.gameText = this.add.text(500, 300, "New", menuText).setOrigin(0.5)
        this.gameText.setShadow(0, 0, 'black', 10);
        this.gameText.setInteractive({useHandCursor: true});
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.start('Create', { controller: self.lobbyController });
        }, this);

        // JOIN BUTTON
        this.gameText = this.add.text(500, 400, "Join", menuText).setOrigin(0.5)
        this.gameText.setShadow(0, 0, 'black', 10);
        this.gameText.setInteractive({useHandCursor: true});
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.start('Join', { controller: self.lobbyController });
        }, this);

        // LOAD BUTTON
        this.gameText = this.add.text(500, 500, "Load", menuText).setOrigin(0.5)
        this.gameText.setShadow(0, 0, 'black', 10);
        this.gameText.setInteractive({useHandCursor: true});
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.start('Load', { controller: self.lobbyController });
        }, this);

        // HEROS' DWELLING
        this.optionsIcon = this.add.image(900, 80, 'optionsicon').setInteractive({useHandCursor: true}).setScale(0.3);
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