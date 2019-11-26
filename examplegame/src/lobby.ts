// const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
//     active: false,
//     visible: false,
//     key: 'Lobby',
//   };
  
export default class LobbyScene extends Phaser.Scene {
    private welcomeText;
    private weedText;
    private gameText;

    constructor() {
        super({key: 'Lobby'});
    }

    public preload() {
        this.load.image('beach','./assets/sample.jpg');
        // this.load.bitmapFont('carrier_command', 'assets/fonts/bitmapFonts/carrier_command.png', 'assets/fonts/bitmapFonts/carrier_command.xml');
    }

    public create() {
        this.add.image(500, 300, 'beach');

        var style1 = { 
            fontFamily: '"Roboto Condensed"',
            fontSize: "70px",
            backgroundColor: "#000"
         }
        this.welcomeText = this.add.text(500,200,"Welcome to Andor Bitches", style1).setOrigin(0.5)
        
        var style2 = { 
            fontFamily: '"Roboto Condensed"',
            fontSize: "40px",
            backgroundColor: "#f00"
         }
        this.weedText = this.add.text(500,300,"Get the herb", style2).setOrigin(0.5)
        this.weedText.setInteractive();
        this.weedText.on('pointerdown', function (pointer) {
            this.scene.start('Weed');
        }, this);

        this.gameText = this.add.text(500,400,"Play the boring game", style2).setOrigin(0.5)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.start('Game');
        }, this);
    }

    public update() {

    }
}