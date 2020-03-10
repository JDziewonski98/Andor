import { HeroWindow } from "../scenes/herowindow";

export class WindowManager extends Phaser.Scene {
    private chatlog
    public static create(self, key: string, obj, gameinstance, data=null) {
        if (key == 'chat') {
            //were making chat window
            var win = new obj(key, gameinstance)
        }
        if (key == 'collab') {
            //were making collab window
            var win = new obj(key, gameinstance)
        }
        else if(typeof obj === typeof HeroWindow){
            //were making hero window
            var win = new obj(key, gameinstance, data);
        }
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