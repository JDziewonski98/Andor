export default class ReadyScreenScene extends Phaser.Scene {
        public archerportrait;
        public warriorportrait;
        public dwarfportrait;
        public mageportrait;
        public selection;
        public selectionmap = {'Archer':200,'Dwarf':410,'Warrior':620,'Mage':830}
    constructor() {
        super({key: 'Ready'});
    }

    public preload() {
        this.load.html('readyform', './assets/readyscreen.html');
    }

    create() {
        this.add.image(500,300,'andordude').setDisplaySize(1000,600)
        this.archerportrait = this.add.image(200,200,'archermale').setDisplaySize(160,200)
        this.dwarfportrait = this.add.image(410,200,'dwarfmale').setDisplaySize(160,200)
        this.warriorportrait = this.add.image(620,200,'warriormale').setDisplaySize(160,200)
        this.mageportrait = this.add.image(830,200,'magemale').setDisplaySize(160,200)
        this.selection = this.add.sprite(200,70,'backbutton').setDisplaySize(48,48)
        this.selection.angle = 90

        var element = this.add.dom(500, 450).createFromCache('readyform');

        var backbutton = this.add.sprite(950,550,'playbutton').setInteractive()
        backbutton.on('pointerdown', function (pointer) {
            this.scene.start('Game');
        }, this);


        var backbutton = this.add.sprite(50,550,'backbutton').setInteractive()
        backbutton.flipX = true
        backbutton.on('pointerdown', function (pointer) {
            this.scene.start('Lobby');
        }, this);

        element.addListener('click');

        //this is how we can interact with the html dom element
        element.on('click', function (event) {
            let name = event.target.name
            if (name === 'Archer' || 'Mage' || 'Dwarf' || 'Warrior')
            {
                console.log('here 1 boio' + name)
                this.scene.selection.x = this.scene.selectionmap[name]

            }
            else {
                //fucks up without this lol
                this.scene.selection.x = this.scene.selection.x
            }

        });

    }



}