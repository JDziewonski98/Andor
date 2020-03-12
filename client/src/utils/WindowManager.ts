import { HeroWindow } from "../scenes/herowindow";
import { Fight } from "../scenes/fightwindow"
export class WindowManager extends Phaser.Scene {
    public static create(self, key: string, obj, data={}) {
        var win = new obj(key, data);
        console.log(self.scene, 'in window manageru')
        self.scene.add(key, win, true);
        return win;
    }

    public static toggle(self, key: string) {
        if (self.scene.isVisible(key)) {
            self.scene.setVisible(false, key)
            self.scene.sendToBack(key)
            self.scene.sleep(key)
        }
        else {
            self.scene.bringToTop(key)
            self.scene.setVisible(true, key)
            self.scene.resume(key)
        }
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