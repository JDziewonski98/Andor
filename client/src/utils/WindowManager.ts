import { HeroWindow } from "../scenes/herowindow";

export class WindowManager extends Phaser.Scene {
<<<<<<< HEAD
    private chatlog
    public static create(self, key: string, obj, gameinstance, data=null) {
        if (key == 'chat') {
            //were making chat window
            var win = new obj(key, gameinstance)
        }
        else if(typeof obj === typeof HeroWindow){
            //were making hero window
            var win = new obj(key, gameinstance, data);
        }
        var win = new obj(key, gameinstance);
=======
    public static create(self, key: string, obj, data={}) {
        var win = new obj(key, data);
>>>>>>> 1e050a8d17306356a06a47961ec00f4806a3b62f
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