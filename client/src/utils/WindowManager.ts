

export class WindowManager extends Phaser.Scene {
    public static create(self, key: string, obj){
        var win = new obj(key);
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
}