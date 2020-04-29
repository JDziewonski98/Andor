import { lobby } from "../api/lobby";

export default class JoinGameScene extends Phaser.Scene {

    private lobbyController: lobby;
    private games;

    constructor() {
        super({key: 'Join'});
    }

    //HTML
    public preload() {
        this.load.html('joinscreen', './assets/templates/joinscreen.html');
    }

    public init(data){
        this.lobbyController = data.controller;
        this.games = []
        var self = this;
        this.lobbyController.getGames( function(games) {
            self.games = games;
        })

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
            color: '#4b5c09',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000',
                blur: 5,
                stroke: true,
                fill: true
            }
         }
        var regularTextStyle = { 
            fontFamily: '"Roboto Condensed"',
            fontSize: "23px",
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
        var title = this.add.text(110, 165, 'Select from existing games:', regularTextStyle);

        //HTML - modify 'joinscreen' for HTML file 
        var element = this.add.dom(410, 200).createFromCache('joinscreen');
        
        this.games.forEach(e => {
            let form = element.getChildByName("Choose Game")
            form.innerHTML = form.innerHTML + '<option value="'+ e + '">' + e + '</option>'
        });

        var self = this;

        //for clicking, Join Game
        element.addListener('click');
        element.on('click', function (event) {
            if (event.target.name === 'submitButton')
            {
                //player must select a game to join game
                var selectedOption = this.getChildByName('Choose Game');
                var gamename = selectedOption.options[selectedOption.selectedIndex].text
                //  Have they entered anything?
                if (selectedOption.value !== '')
                {
                    self.lobbyController.addPlayerToGame(gamename, null);
                    self.scene.start('Ready', {name: gamename})
                }
            }
        });

        //go back
        var gobackbtn = this.add.sprite(80, 475, 'goback').setInteractive({useHandCursor: true}).setScale(0.5)
        gobackbtn.on('pointerdown', function (pointer) {
            this.scene.start('Lobby');
        }, this);
    }

    //transition into Ready scene.
    public changescene() {
        this.scene.start('Ready')
    }

    public update() {

    }
}