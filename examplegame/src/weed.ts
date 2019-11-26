
export default class WeedScene extends Phaser.Scene {
    private weedText;
    private herb: Phaser.GameObjects.Sprite & { body: Phaser.Physics.Arcade.Body};

    constructor() {
        super({key: 'Weed'});
    }

    public preload() {
        this.load.image('beach','./assets/sample.jpg');
        this.load.image('weed', './assets/8bit_herb.jpeg')
    }

    public create() {
        this.add.image(500, 300, 'beach')

        var style1 = { 
            fontFamily: '"Roboto Condensed"',
            fontSize: "70px",
            backgroundColor: "#000"
         }
        this.weedText = this.add.text(500,200,"get that herb", style1).setOrigin(0.5)
        
        this.herb = this.add.sprite(500, 300, 'weed').setOrigin(0.5) as any
        //Weed physics
        this.physics.add.existing(this.herb)
        this.herb.setInteractive();
        this.herb.on('pointerdown', function (pointer) {
            this.scene.start('Lobby');
        }, this);
    }

    public update() {
        const cursorKeys = this.input.keyboard.createCursorKeys();
 
        if (cursorKeys.up.isDown) {
            this.herb.body.setVelocityY(-1000);
        } else if (cursorKeys.down.isDown) {
            this.herb.body.setVelocityY(600);
        } else {
            while (this.herb.body.velocity.y != 0){
                if (this.herb.body.velocity.y > 0) {
                this.herb.body.setVelocityY(this.herb.body.velocity.y - 1);
                }
                else {
                this.herb.body.setVelocityY(this.herb.body.velocity.y + 1);
                }
            }
        }
        if (cursorKeys.right.isDown) {
            this.herb.body.setVelocityX(500);
        } else if (cursorKeys.left.isDown) {
            this.herb.body.setVelocityX(-500);
        } else {
            this.herb.body.setVelocityX(0);
        }
    }
}