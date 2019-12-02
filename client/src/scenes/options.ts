import AndorGame from "../main"
import { andorGame } from "../main"

export default class Options extends Phaser.Scene {
    private parent
    private optionsText
    private backText
    private soundOff;
    private soundOn;
    private model;

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
    }

    public create() {
        // let andorGame = this.sys.game as AndorGame
        this.model = andorGame.globals.model

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
            this.model.musicOn = !this.model.musicOn
            this.soundOff.visible = true;
            this.updateAudio();
        }, this);

        this.soundOff.on('pointerdown', function (pointer) {
            this.model.musicOn = !this.model.musicOn
            this.soundOff.visible = false;
            this.updateAudio();
        }, this);

        this.backText = this.add.text(500, 400, "Back", style1).setOrigin(0.5).setInteractive();
        this.backText.on('pointerdown', function (pointer) {
            this.sys.game.scene.sendToBack('Options')
        }, this);

        this.updateAudio();
    }

    public updateAudio() {
        if (this.model.musicOn === false) {
          andorGame.globals.bgMusic.stop();
          this.model.bgMusicPlaying = false;
        } else {
          if (this.model.bgMusicPlaying === false) {
            andorGame.globals.bgMusic.play();
            this.model.bgMusicPlaying = true;
          }
        }
      }

    // create ()
    // {
    //     this.add.text(1,2,'Options',{backgroundColor: '0xf00'})
    //     this.herowindow()
    //     this.cameras.main.setViewport(this.parent.x, this.parent.y, 300, 200)
    //     this.cameras.main.setBackgroundColor("6E8C97")
    // }

    // refresh ()
    // {
    //     this.cameras.main.setPosition(this.parent.x, this.parent.y);
    //     this.scene.bringToTop();
    // }

    // public revive() {
    //     this.scene.bringToTop()
    // }

    // herowindow(){
    //     this.add.sprite(50, 50, 'weed').setOrigin(0.5);
    //     this.add.text(50,100,'Gold: 5',{backgroundColor: 'fx00'})
    //     this.add.text(50,120,'Willpower: 7',{backgroundColor: 'fx00'})
    //     this.add.text(50,140,'Strength: 7',{backgroundColor: 'fx00'})
    //     this.add.text(100,10,'Special Class\nAbility Stuff',{backgroundColor: 'fx00'})
    // }
}