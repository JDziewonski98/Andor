import { Tile } from "./tile";
import { game } from "../api/game";

export class BrokenWell extends Phaser.GameObjects.Image {
    private tile: Tile;
    private gameController: game;
    private used: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, tile: Tile, gameController: game) {
        super(scene, x, y, texture);
        this.tile = tile;
        this.gameController = gameController;
    }

    public getTileID() {
        return this.tile.getID();
    }
}