import { Stars } from './Stars';

export default class LobbyScene extends Phaser.Scene {
    private welcomeText;
    private weedText;
    private gameText;
    private scaleRatio = window.devicePixelRatio / 3;
    constructor() {
        super({key: 'Lobby'});
    }

    public preload() {
        this.load.image('beach','./assets/sample.jpg');
        this.load.image('map','./assets/andor_map.jpg');
        this.load.image('weed', './assets/8bit_herb.jpeg')
        this.load.image('desert', './assets/fantasydesert.jpg')
        this.load.image('andordude','./assets/andordude.jpg')
    }

    public create() {
        var bg = this.add.image(500, 300, 'beach');
        var style1 = { 
            fontFamily: '"Roboto Condensed"',
            fontSize: "70px",
            backgroundColor: "#000"
         }
        this.welcomeText = this.add.text(500,200,"Welcome to Andor", style1).setOrigin(0.5)
        
        var style2 = { 
            fontFamily: '"Roboto Condensed"',
            fontSize: "40px",
            backgroundColor: "#f00"
         }
        this.weedText = this.add.text(500,300,"New", style2).setOrigin(0.5)
        this.weedText.setInteractive();
        this.weedText.on('pointerdown', function (pointer) {
            this.scene.start('Create');
        }, this);

        this.gameText = this.add.text(500,400,"Join", style2).setOrigin(0.5)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.start('Join');
        }, this);

        this.gameText = this.add.text(500,500,"Load", style2).setOrigin(0.5)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.start('Weed');
        }, this); 
        
        this.addChat();
        this.gameText = this.add.text(800,550,"CHAT", style2).setOrigin(0.5)
        this.gameText.setInteractive();
        this.gameText.on('pointerdown', function (pointer) {
            this.scene.setVisible(!this.scene.isVisible('chat'), 'chat');

            
        }, this); 
        
    }

    private addChat(){
        var x = Phaser.Math.Between(400, 600);
        var y = Phaser.Math.Between(64, 128);

        var key = 'chat';

        var win = this.add.zone(x, y, 328, 266).setInteractive().setOrigin(0);

        var demo = new Stars(key, win);

        this.input.setDraggable(win);

        win.on('drag', function (pointer, dragX, dragY) {

            this.x = dragX;
            this.y = dragY;

            demo.refresh()

        });

        this.scene.add(key, demo, true);
        this.scene.setVisible(false, key)
    }

    public update() {

    }
}