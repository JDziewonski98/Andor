import { NONE } from "phaser";


export class WindowManager extends Phaser.Scene {
    public static create(self, key: string, obj, icon : string = null, gameinstance = null){
        if (gameinstance != null) {
            //were making chat window
            console.log('in window manager:',gameinstance)
            var win = new obj(key, gameinstance)
        }
        else if (icon == null) {
            var win = new obj(key);
        }
        else {
            //were making hero window
            var win = new obj(key, icon);
        }
        self.scene.add(key, win, true);
        return win;
    }

    public static toggle(self, key: string){
        self.scene.setVisible(!self.scene.isVisible(key), key);
    }

    public static destroy(self, key: string){
        self.scene.stop(key);
        self.scene.remove(key);
    }

    public static get(self, key: string){
        return self.scene.get(key)
    }
}