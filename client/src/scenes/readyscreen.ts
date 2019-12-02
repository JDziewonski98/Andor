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
        this.load.html('readyform', './assets/readyscreen.html')
        this.load.html('readytable','./assets/readytable.html')
    }

    create() {
        this.add.image(500,300,'andordude').setDisplaySize(1000,600)
        this.archerportrait = this.add.image(200,200,'archermale').setDisplaySize(160,200)
        this.dwarfportrait = this.add.image(410,200,'dwarfmale').setDisplaySize(160,200)
        this.warriorportrait = this.add.image(620,200,'warriormale').setDisplaySize(160,200)
        this.mageportrait = this.add.image(830,200,'magemale').setDisplaySize(160,200)
        this.selection = this.add.sprite(200,70,'backbutton').setDisplaySize(48,48)
        this.selection.angle = 90
        this.add.text(200,450,'Ready?',{ fontFamily: '"Roboto Condensed"',fontSize: "40px",color:"#E42168"})

        var heroselect = this.add.dom(400, 420).createFromCache('readyform')
        //var readytable = this.add.dom(690,420).createFromCache('readytable')

        var backbutton = this.add.sprite(950,550,'playbutton').setInteractive()
        backbutton.on('pointerdown', function (pointer) {
            this.scene.start('Game');
        }, this);


        var backbutton = this.add.sprite(50,550,'backbutton').setInteractive()
        backbutton.flipX = true
        backbutton.on('pointerdown', function (pointer) {
            this.scene.start('Lobby');
        }, this);

        heroselect.addListener('click');

        //this is how we can interact with the html dom element
        heroselect.on('click', function (event) {
            let name = event.target.name
            if (name === 'Archer' ||name === 'Mage' ||name === 'Dwarf' ||name === 'Warrior')
            {
                console.log('here 1 boio' + name)
                this.scene.selection.x = this.scene.selectionmap[name]

            }
            else {
            }

        });

        //Options: issue - DOM elements render above all scenes so looks finicky
        // var optionsIcon = this.add.image(930, 80, 'optionsIcon').setInteractive();
        // optionsIcon.on('pointerdown', function (pointer) {
        //     this.sys.game.scene.bringToTop('Options')
        //     this.sys.game.scene.getScene('Options').scene.setVisible(true, 'Options')
        //     this.sys.game.scene.resume('Options')
        // }, this);

    }



}