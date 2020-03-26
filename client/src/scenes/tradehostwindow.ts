import { Window } from "./window";
import { game } from '../api/game';
import { WindowManager } from "../utils/WindowManager";


export class TradeHostWindow extends Window {
    private gameinstance
    private windowname
    private host
    private recipient

    public constructor(key: string, data, windowData = { x: 350, y: 30, width: 400, height: 250 }) {
        super(key, windowData);
        this.gameinstance = data.controller
        this.windowname = key
        this.host = data.host
        this.recipient = data.recipient
    }

    protected initialize() {
        var self = this
        var bg = this.add.image(0, 0, 'scrollbg').setOrigin(0.5)
    }

}