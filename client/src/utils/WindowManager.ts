

export class WindowManager extends Phaser.Scene {


    public static create(self, key, obj){
        var win = new obj(key, {x:0, y:0, width: 300, length:400});
        self.scene.add(key, win, true);
        self.scene.setVisible(false, key)
        return win;
    }

    public static toggle(self, key){
        self.scene.setVisible(!self.scene.isVisible('chat'), key);
        self.scene.sendToBack();
    }

    public static destroy(self, key){
        self.scene.remove(key);
    }
}