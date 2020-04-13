import { Tile } from "./tile";
import { game } from "../api/game";
import { WindowManager, MerchantWindow } from "../scenes/windows";
import { Hero } from "./hero";

export class Merchant extends Phaser.GameObjects.Image {
    private tile: Tile;
    private gameController: game;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, tile: Tile, gameController: game) {
        super(scene, x, y, texture);
        this.tile = tile;
        this.gameController = gameController;

        this.setInteractive();
    }

    public getTileID() {
        return this.tile.getID();
    }
}