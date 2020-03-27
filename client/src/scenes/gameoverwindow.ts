import { Window } from "./window";
import { game } from "../api/game";

export class GameOverWindow extends Window {
    private leaveGameText;
    private sceneKey;
    private gameController: game;

    public constructor(key: string, data) {
        super(key, {x: data.x, y: data.y, width: data.w, height: data.h})
        this.sceneKey = key;
        this.gameController = data.controller;
    }

    protected initialize() {
        var self = this;
        this.add.image(0, 0, 'scrollbg').setOrigin(0.5);

        var textStyle = {
            backgroundColor: 'fxb09696',
            fontSize: 25
        }
        var buttonTextStyle = {
            backgroundColor: 'fxb09696',
            fontSize: 15
        }
        this.add.text(20, 50, "Game Over: You lost :\(", textStyle);
        this.leaveGameText = this.add.text(20, 150, "Return to Lobby", buttonTextStyle);

        this.leaveGameText.setInteractive();
        this.leaveGameText.on('pointerdown', function (pointer) {
            console.log("Leave game pointerdown")
        }, this);
    }
}