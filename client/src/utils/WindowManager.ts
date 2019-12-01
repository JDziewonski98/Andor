

export class WindowManager extends Phaser.Scene {


    public static create(self, key, obj){
        var win = new obj(key);
        self.scene.add(key, win, true);
        self.scene.setVisible(false, key)
        return win;
    }

    public static toggle(self, key){
        self.scene.setVisible(!self.scene.isVisible('chat'), key);
    }

    public static destroy(self, key){
        self.scene.remove(key);
    }
}