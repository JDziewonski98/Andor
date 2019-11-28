
export default class JoinGameScene extends Phaser.Scene {
    private gameText

    constructor() {
        super({key: 'Join'});
    }

    public preload() {
    }

    public create() {
        var style2 = { 
            fontFamily: '"Roboto Condensed"',
            fontSize: "50px"
         }
        this.gameText = this.add.text(500,250,"Click To Play Game",style2).setOrigin(0.5)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.start('Game');
        }, this);
    }


    public update() {

    }
}