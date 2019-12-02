
export default class CreateGameScene extends Phaser.Scene {


    constructor() {
        super({key: 'Create'});
    }

    public preload() {
        this.load.html('nameform', './assets/nameform.html');
    }

    public create() {
        console.log(this)
        var background = this.add.image(500,300,'desert').setDisplaySize(1000,600)
        var style2 = { 
            fontFamily: '"Roboto Condensed"',
            fontSize: "20px",
            color: '#ff0'
         }
        var title = this.add.text(270, 10, 'Username:', style2);
        //this is how we can add html elements
        var element = this.add.dom(410, 200).createFromCache('nameform');

        
        var subtitle = this.add.text(350, 90, 'Difficulty: easy/normal', style2);
        var subtitle = this.add.text(350, 200, 'Player number', style2);
        var passtitle = this.add.text(270,300,'Password:', style2);
        element.addListener('click');

        //this is how we can interact with the html dom element
        element.on('click', function (event) {
 
            if (event.target.name === 'submitButton')
            {
                var inputText = this.getChildByName('Game Name');

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
                        targets: title,
                        alpha: 0.2,
                        duration: 200,
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