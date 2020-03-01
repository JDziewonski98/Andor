import { lobby } from "../api";

export default class LobbyScene extends Phaser.Scene {
    private welcomeText;
    private weedText;
    private gameText;
    private optionsIcon;
    private scaleRatio = window.devicePixelRatio / 3;
    private lobbyController;

    constructor() {
        super({
            key: 'Lobby',
            active: true
        });
    }

    public init(data){
        this.lobbyController = new lobby();
    }

    public preload() {
        this.load.image('beach', './assets/swamp.jpg');
        this.load.image('weed', './assets/8bit_herb.jpeg')
        this.load.image('desert', './assets/fantasydesert.jpg')
        this.load.image('mountains', './assets/mountains_bg.jpg')
        this.load.image('andordude', './assets/andordude.jpg')
        this.load.image('gameboard', './assets/Andor_Board.jpg')
        this.load.image('backbutton', './assets/Pass.png')
        this.load.image('playbutton', './assets/Play.png')
        this.load.image('warriormale', './assets/warriormale.png')
        this.load.image('magemale', './assets/magemale.png')
        this.load.image('dwarfmale', './assets/dwarfmale.png')
        this.load.image('archermale', './assets/archermale.png')
        this.load.image('fantasyhome', './assets/fantasyhome.jpg')
        this.load.image('optionsIcon', './assets/icons/settings_icon.png')
        this.load.image('scrollbg','./assets/windowbg.jpg')
    }

    public create() {
        // Scale the game size to the original screen size of pre-game-entry
        // scenes (lobby, load, join, etc). This has the effect of keeping desired
        // behaviour of Phaser Game autoscaling, while keeping the actual game size
        // larger.
        var reducedWidth = 1000;
        var reducedHeight = 600;
        this.scale.setGameSize(reducedWidth, reducedHeight);
        
        // Initially hide Options and BoardOverlay scenes
        this.scene.sleep('BoardOverlay')
        this.scene.sleep('Options')
        
        this.draw()

        this.connect()
    }

    private connect() {
        this.lobbyController.addNewPlayerToLobby()
    }

    private draw() {
        var bg = this.add.image(500, 300, 'beach').setDisplaySize(1000, 600)
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
        var self = this;
        this.weedText = this.add.text(500, 300, "New", style2).setOrigin(0.5)
        this.weedText.setInteractive();
        this.weedText.on('pointerdown', function (pointer) {
            this.scene.start('Create',{controller:self.lobbyController});
        }, this);

        this.gameText = this.add.text(500, 400, "Join", style2).setOrigin(0.5)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.start('Join',{controller:self.lobbyController});
        }, this);

        this.gameText = this.add.text(500, 500, "Load", style2).setOrigin(0.5)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.start('Load');
        }, this);

        this.optionsIcon = this.add.image(930, 80, 'optionsIcon').setInteractive();
        this.optionsIcon.on('pointerdown', function (pointer) {
            this.sys.game.scene.bringToTop('Options')
            this.sys.game.scene.getScene('Options').scene.setVisible(true, 'Options')
            this.scene.resume('Options')
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