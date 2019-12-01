
export default class JoinGameScene extends Phaser.Scene {

    constructor() {
        super({key: 'Join'});
    }

    //HTML
    public preload() {
        this.load.html('joinscreen', './assets/joinscreen.html');
    }

    //create the join screen
    public create() {
        //adding background via picture fantasyhome
        //consult lobby.ts for fantasyhome inclusion
        //titleStyle, may need to add shadowing for better visibility
        //regularTextStyle, for other texts
        var background = this.add.image(500,300,'fantasyhome').setDisplaySize(1000,600)
        var titleStyle = { 
            fontFamily: '"Roboto Condensed"',
            fontSize: "50px",
            color: '#FFF',
            shadow: {
                offsetX: 5,
                offsetY: 2,
                color: '#000',
                blur: 5,
                stroke: true,
                fill: true
            }
         }
        var regularTextStyle = { 
            fontFamily: '"Roboto Condensed"',
            fontSize: "20px",
            color: '#89B4B3',
            shadow: {
                offsetX: 5,
                offsetY: 2,
                color: '#000',
                blur: 4,
                stroke: true,
                fill: true
            }
        }

        //putting Join Game on the screen 
        var gameText = this.add.text(500,100,"Join Game",titleStyle).setOrigin(0.5)

        //putting select title on the screen just below join game and move left
        var title = this.add.text(125, 145, 'Select from existing games:', regularTextStyle);


        //HTML - modify 'joinscreen' for HTML file
        var element = this.add.dom(410, 200).createFromCache('joinscreen');



        //for clicking, Join Game
        element.addListener('click');
        element.on('click', function (event) {
            if (event.target.name === 'submitButton')
            {
                this.scene.changescene()
            }

        });

        //go back
        var backbutton = this.add.sprite(50,550,'backbutton').setInteractive()
        backbutton.flipX = true
        backbutton.on('pointerdown', function (pointer) {
            this.scene.start('Lobby');
        }, this);
    }

    //transition into Game scene.
    public changescene() {
        this.scene.start('Ready')
    }

    public update() {

    }
}