import { lobby } from "../api"
export default class LoadGameScene extends Phaser.Scene {

    constructor() {
        super({key: 'Load'});
    }

    public preload() {
        this.load.html('loadgame_form', './assets/loadgame_form.html');
    }

    public create() {
        // getGames(function (games){
        //     console.log("Finally got games inside load game: ", games)
        // })
        
        var background = this.add.image(500,300,'mountains').setDisplaySize(1000,600)
        var style2 = { 
            fontFamily: '"Roboto Condensed"',
            fontSize: "20px",
            color: '#fff',
            shadow: {
                offsetX: 1,
                offsetY: 2,
                color: '#000',
                blur: 2,
                stroke: true,
                fill: true
            }
         }

        var title = this.add.text(200, 50, 'Choose the game that you wish to load:', style2);
        var gameName = this.add.text(200, 90, 'Game name:', style2);
        var form = this.add.dom(380, 190).createFromCache('loadgame_form');
        var passtitle = this.add.text(200, 235,'Enter Password:', style2)
        form.addListener('click');

        //this is how we can interact with the html dom element
        form.on('click', function (event) {

            if (event.target.name === 'submitButton')
            {
                var inputText = this.getChildByName('passField');

                //  Have they entered anything?
                if (inputText.value !== '')
                {
                    //  Turn off the click events
                    this.removeListener('click')

                    this.setVisible(false)

                    //for some reason u can't just go this.scene.start('x') ??????
                    this.scene.changescene()
                }
                else
                {
                    //  Flash the prompt
                    this.scene.tweens.add({
                        targets: passtitle,
                        alpha: 0.2,
                        duration: 300,
                        ease: 'Power3',
                        yoyo: true
                    });
                            }
            }

        });

        var backbutton = this.add.sprite(50,550,'backbutton').setInteractive()
        backbutton.flipX = true
        backbutton.on('pointerdown', function (pointer) {
            this.scene.start('Lobby');
        }, this);
    }

    public changescene() {
        this.scene.start('Ready')
    }

    public update() {

    }
}