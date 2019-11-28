
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
            fontSize: "20px"
         }
        console.log('create')
        //this.cameras.main.setBackgroundColor('#42adf5');
        var title = this.add.text(240, 10, 'Please enter your game name', style2);
        var element = this.add.dom(410, 200).createFromCache('nameform');
        var title = this.add.text(350, 100, 'Difficulty: easy/normal', style2);
        var title = this.add.text(350, 200, 'Player number', style2);
        var passtitle = this.add.text(240,300,'Enter Password:', style2)
        //element.setPerspective(800);
        element.addListener('click');
        var myself = this

    element.on('click', function (event) {

        if (event.target.name === 'submitButton')
        {
            var inputText = this.getChildByName('passField');

            //  Have they entered anything?
            if (inputText.value !== '')
            {
                //  Turn off the click events
                this.removeListener('click')

                this.setVisible(false)

                //for some reason u can just go this.scene.start('x') ??????
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
    }
    public changescene() {
        this.scene.start('Game')
    }

    public update() {

    }
}