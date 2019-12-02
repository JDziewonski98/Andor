
export default class Options extends Phaser.Scene {
    private optionsText
    private backText
    private soundOff;
    private soundOn;
    private musicStarted;

    constructor() {
        super({
            key: 'Options',
            active: true
        })
    }

    public preload() {
        this.load.image('beach2', './assets/swamp.jpg');
        this.load.image('soundon','./assets/SongOn.png')
        this.load.image('soundoff','./assets/SongOff.png')

        this.load.audio('music', 'assets/doxent_-_Arcane.mp3')
    }

    public create() {
        // let andorGame = this.sys.game as AndorGame
        // this.model = andorGame.globals.model
        let music = this.game.sound.add('music')

        var bg = this.add.image(500, 300, 'beach2').setDisplaySize(1000,600)
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
        this.optionsText = this.add.text(500, 200, "Options", style1).setOrigin(0.5)
        // Images for toggling sound on and off
        this.soundOn = this.add.image(500, 300, 'soundon').setOrigin(0.5).setInteractive();
        this.soundOff = this.add.image(500, 300, 'soundoff').setOrigin(0.5).setInteractive();

        this.soundOn.on('pointerdown', function (pointer) {
            music.pause()

            this.soundOff.visible = true;
        }, this);

        this.soundOff.on('pointerdown', function (pointer) {
            if (!this.musicStarted) {
                music.play({
                    loop: true,
                    volume: 0.5
                })
                this.musicStarted = true
            } else { //music started already
                music.resume()
            }        

            this.soundOff.visible = false;
        }, this);

        this.backText = this.add.text(500, 400, "Back", style1).setOrigin(0.5).setInteractive();
        this.backText.on('pointerdown', function (pointer) {
            this.sys.game.scene.getScene('Options').scene.setVisible(false, this.currentScene)
            this.sys.game.scene.sendToBack('Options')
            this.sys.game.scene.pause('Options')
        }, this);
    }
}