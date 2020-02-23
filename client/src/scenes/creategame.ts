import { lobby } from "../api";

export default class CreateGameScene extends Phaser.Scene {
    private lobbyController: lobby;

    constructor() {
        super({ key: 'Create' });
    }

    public init(data){
        this.lobbyController = data.controller;
        console.log('here xxxxxxxxxxxxxxx importanto')
    }

    public preload() {
        this.load.html('nameform', './assets/nameform.html');
    }

    public create() {
        var background = this.add.image(500, 300, 'desert').setDisplaySize(1000, 600)
        var style2 = {
            fontFamily: '"Roboto Condensed"',
            fontSize: "20px",
            color: '#ff0'
        }
        var title = this.add.text(270, 10, 'Game Name:', style2);
        //this is how we can add html elements
        var element = this.add.dom(410, 200).createFromCache('nameform');


        var subtitle = this.add.text(350, 90, 'Difficulty: easy/normal', style2);
        var subtitle = this.add.text(350, 200, 'Player number', style2);
        var passtitle = this.add.text(270, 300, 'Password:', style2);
        element.addListener('click');

        var self = this;
        //this is how we can interact with the html dom element
        element.on('click', function (event) {

            if (event.target.name === 'submitButton') {
                var inputText = this.getChildByName('Game Name');

                //  Have they entered anything?
                if (inputText.value !== '') {
                    //  Turn off the click events
                    this.removeListener('click')

                    self.lobbyController.createGame(inputText.value, 4, "Easy");

                    this.setVisible(false)

                    self.scene.start('Ready', {name: inputText.value})
                }
                else {
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

        var backbutton = this.add.sprite(50, 550, 'backbutton').setInteractive()
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