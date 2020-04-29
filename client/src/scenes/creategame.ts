import { lobby } from "../api";
import TextEdit from 'phaser3-rex-plugins/plugins/textedit.js';
import BBCodeText from 'phaser3-rex-plugins/plugins/bbcodetext.js';
import { RoundRectangle } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import { reducedWidth, reducedHeight } from "../constants";

export default class CreateGameScene extends Phaser.Scene {
    private lobbyController: lobby;
    private numPlayers: number = 1; //TODO ACUI: change this to 2

    constructor() {
        super({ key: 'Create' });
    }

    public init(data){
        this.lobbyController = data.controller;
    }

    public preload() {
        this.load.image("createsubmit", "../assets/pregame-components/createsubmitbutton.png")
    }

    public create() {
        var background = this.add.image(500, 300, 'desert').setDisplaySize(1000, 600)
        var textStyle = {
            fontSize: "20px",
            color: '#ff0',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 2,
                stroke: true,
                fill: true
            }
        }

        var title = this.add.text(reducedWidth/2, reducedHeight/2-130, 'Choose a name for your game:', textStyle).setOrigin(0.5);

        // Rex plugin edittext
        var nameErrorBg = new RoundRectangle(this, reducedWidth/2, reducedHeight/2-80, 410, 70, 2, 0xff0000);
        this.add.existing(nameErrorBg);
        nameErrorBg.alpha = 0;
        var nameText = new BBCodeText(this, reducedWidth/2, reducedHeight/2-80, 'my_legend', {
            color: 'yellow',
            fontSize: '35px',
            fixedWidth: 400,
            fixedHeight: 60,
            backgroundColor: '#333333',
            valign: 'center',
            halign: 'center'
        })
        this.add.existing(nameText);
        var editNameText = new TextEdit(nameText);
        nameText.setOrigin(0.5).setInteractive().on('pointerdown', () => {
            editNameText.open();
        })

        var subtitle = this.add.text(reducedWidth/2, reducedHeight/2+10, 'Choose the number of players:', textStyle).setOrigin(0.5);

        var panel3bg = new RoundRectangle(this, reducedWidth/2, reducedHeight/2+60, 66, 66, 10, 0xffff00);
        var panel2bg = new RoundRectangle(this, reducedWidth/2-85, reducedHeight/2+60, 66, 66, 10, 0xffff00);
        var panel4bg = new RoundRectangle(this, reducedWidth/2+85, reducedHeight/2+60, 66, 66, 10, 0xffff00);
        panel3bg.visible = false;
        panel4bg.visible = false;
        this.add.existing(panel2bg);
        this.add.existing(panel3bg);
        this.add.existing(panel4bg);
        var panel3 = new RoundRectangle(this, reducedWidth/2, reducedHeight/2+60, 60, 60, 10, 0x333333);
        var panel2 = new RoundRectangle(this, reducedWidth/2-85, reducedHeight/2+60, 60, 60, 10, 0x333333);
        var panel4 = new RoundRectangle(this, reducedWidth/2+85, reducedHeight/2+60, 60, 60, 10, 0x333333);
        this.add.existing(panel2);
        this.add.existing(panel3);
        this.add.existing(panel4);
        panel2.setInteractive().on('pointerdown', () => {
            buttonToggle(2);
        })
        panel3.setInteractive().on('pointerdown', () => {
            buttonToggle(3);
        })
        panel4.setInteractive().on('pointerdown', () => {
            buttonToggle(4);
        })

        var numTextStyle = {
            color: 'yellow',
            fontSize: '30px'
        }
        var button3 = this.add.text(reducedWidth/2, reducedHeight/2+60, '3', numTextStyle).setOrigin(0.5);
        var button2 = this.add.text(reducedWidth/2-85, reducedHeight/2+60, '2', numTextStyle).setOrigin(0.5);
        var button4 = this.add.text(reducedWidth/2+85, reducedHeight/2+60, '4', numTextStyle).setOrigin(0.5);
        button2.setInteractive().on('pointerdown', () => {
            buttonToggle(2);
        })
        button3.setInteractive().on('pointerdown', () => {
            buttonToggle(3);
        })
        button4.setInteractive().on('pointerdown', () => {
            buttonToggle(4);
        })
        var self = this;
        function buttonToggle(num: number) {
            switch(num) {
                case 2:
                    self.numPlayers = 2;
                    panel2bg.visible = true;
                    panel3bg.visible = false;
                    panel4bg.visible = false;
                    break;
                case 3:
                    self.numPlayers = 3;
                    panel2bg.visible = false;
                    panel3bg.visible = true;
                    panel4bg.visible = false;
                    break;
                case 4:
                    self.numPlayers = 4;
                    panel2bg.visible = false;
                    panel3bg.visible = false;
                    panel4bg.visible = true;
            }
        }

        var submitButton = this.add.image(reducedWidth/2, reducedHeight/2+150, 'createsubmit').setOrigin(0.5).setScale(0.4);
        this.add.existing(submitButton);
        submitButton.setInteractive({useHandCursor: true}).on('pointerdown', () => {
            // create game
            let gameName = nameText.text;
            if (gameName == '') { // name cannot be empty string
                nameText.setText('Cannot be empty');
                self.tweens.add({
                    targets: nameErrorBg,
                    alpha: 1,
                    duration: 300,
                    ease: 'Power3',
                    yoyo: true
                });
                return;
            };
            console.log('Creating new game:', gameName, this.numPlayers);
            self.lobbyController.createGame(gameName, self.numPlayers, "Easy");

            self.scene.sleep('Create');
            self.scene.start('Ready', {name: gameName});
        })

        var self = this;
        var gobackbtn = this.add.sprite(80, 475, 'goback').setInteractive({useHandCursor: true}).setScale(0.5)
        gobackbtn.on('pointerdown', function (pointer) {
            this.scene.start('Lobby');
        }, this);
    }

    public update() {

    }
}