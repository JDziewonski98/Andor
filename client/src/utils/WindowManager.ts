import { HeroWindow } from "../scenes/herowindow";

export class WindowManager extends Phaser.Scene {
    public static create(self, key: string, obj, data={}) {
        var win = new obj(key, data);
        self.scene.add(key, win, true);
        return win;
    }

    public static toggle(self, key: string) {
        self.scene.setVisible(!self.scene.isVisible(key), key);
    }

    public static destroy(self, key: string) {
        self.scene.stop(key);
        self.scene.remove(key);
    }

    public static get(self, key: string) {
        return self.scene.get(key)
    }
}