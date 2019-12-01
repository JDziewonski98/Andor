export default class ReadyScreenScene extends Phaser.Scene {
        
    constructor() {
        super({key: 'Ready'});
    }

    create() {
        this.add.image(500,300,'andordude').setDisplaySize(1000,600)



        var backbutton = this.add.sprite(500,300,'playbutton').setInteractive()
        backbutton.on('pointerdown', function (pointer) {
            this.scene.start('Game');
        }, this);


        var backbutton = this.add.sprite(50,550,'backbutton').setInteractive()
        backbutton.flipX = true
        backbutton.on('pointerdown', function (pointer) {
            this.scene.start('Lobby');
        }, this);

    }



}