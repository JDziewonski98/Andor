import { Window } from "./window";
import { game } from "../api/game";

export class Fight extends Window {
    private gameinstance: game;

    public constructor(key, data, windowData = { x: 10, y: 10, width: 350, height: 250 }) {
        super(key, windowData);
        this.gameinstance = data.controller
    }

    protected initialize() {
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
        bg.tint = 0xff0000
    }
}