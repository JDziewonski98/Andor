import { Chat } from './chatwindow';
import { HeroWindow } from './herowindow';
import { WindowManager } from "../utils/WindowManager";
import { game } from '../api/game';
import { Tile } from '../objects/tile';
import { Monster } from '../objects/monster';
import { HourTracker } from '../objects/hourTracker';
import { Well } from '../objects/well';
import { reducedWidth, reducedHeight, mOffset } from '../constants';
import { HeroKind } from '../objects/HeroKind';
// UI plugin
import { ScrollablePanel, RoundRectangle, FixWidthSizer } 
    from 'phaser3-rex-plugins/templates/ui/ui-components.js';

export default class BoardOverlay extends Phaser.Scene {
    private parent: Phaser.GameObjects.Zone
    private heroButtons: Map<string, Phaser.GameObjects.Image> = new Map();
    private gameinstance: game;
    private endTurnButton: Phaser.GameObjects.Image;
    private chatButton: Phaser.GameObjects.Image;
    private endturntext;
    private clientheroobject;
    private herb;

    // End Day
    private endDayButton: Phaser.GameObjects.Image;
    private tiles: Tile[];
    private monsterNameMap: Map<string, Monster>;
    private hourTracker: HourTracker;
    private wells: Map<string, Well>;
    private hk: HeroKind;

    // Positioning
    private x = 0;
    private y = 0;
    private width = reducedWidth;
    private height = reducedHeight;

    // Scrollable panel
    private COLOR_PRIMARY = 0xD9B382;
    private COLOR_LIGHT = 0x7b5e57;
    private COLOR_DARK = 0x4B2504;

    constructor(data) {
        super({
            key: 'BoardOverlay'
        })
        this.gameinstance = data.gameinstance;
        this.tiles = data.tiles;
        this.monsterNameMap = data.monsterMap;
        this.hourTracker = data.hourTracker;
        this.wells = data.wells;
        this.hk = data.hk
        this.clientheroobject = data.clientheroobject
        this.herb = data.herb;
    }

    public init() { }

    public preload() {
        this.load.image('hourbar', './assets/hours.PNG')
        this.load.image('endturnicon', './assets/endturn.png')
        this.load.image('enddayicon', './assets/endday.png')
        this.load.image('chaticon', './assets/chat.png')
        this.load.image('archericon', './assets/archerbtn.png')
        this.load.image('dwarficon', './assets/dwarfbtn.png')
        this.load.image('mageicon', './assets/magebtn.png')
        this.load.image('warrioricon', './assets/warriorbtn.png')

        // UI Plugin
        // this.load.scenePlugin({
        //     key: 'rexuiplugin', 
        //     url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 
        //     sceneKey: 'rexUI'
        // });
    }

    private addHeroCard(type, x) {
        var self = this;
        console.log(type, typeof type)
        switch (type) {
            case "archer":
                this.heroButtons.set(type, this.add.image(x+55, 25, 'archericon').setScale(0.25));
                break;
            case "dwarf":
                this.heroButtons.set(type, this.add.image(x+55, 25, 'dwarficon').setScale(0.25));
                break;
            case "mage":
                this.heroButtons.set(type, this.add.image(x+55, 25, 'mageicon').setScale(0.25));
                break;
            case "warrior":
                this.heroButtons.set(type, this.add.image(x+55, 25, 'warrioricon').setScale(0.25));
                break;
        }
        console.log("CAN WE FIND IT*** ",this.heroButtons)
        this.heroButtons.get(type).on('pointerdown', (pointer) => {
            console.log("CLICKING")
            this.gameinstance.getHeroAttributes(type, (herodata) => {
                console.log(herodata)
                const cardID = `${type}Card`;
                if (this.scene.isVisible(cardID)) {
                    console.log(this)
                    var thescene = WindowManager.get(this, cardID)
                    thescene.disconnectListeners()
                    WindowManager.destroy(this, cardID);
                } else {
                    console.log('in board overlay:xxxxxxxxxxxxxxx', this.clientheroobject)
                    WindowManager.create(this, cardID, HeroWindow,
                        {
                            controller: this.gameinstance,
                            icon: `${type}male`,
                            clienthero: this.hk,
                            windowhero: type,
                            ...herodata,
                            clientherotile: this.clientheroobject.tile.id,
                            x: pointer.x,
                            y: pointer.y + 20
                        }
                    );
                }
            })

        }, this);
    }

    public create() {
        // Set the overlay as a top bar on the game
        this.parent = this.add.zone(this.x, this.y, this.width, this.height).setOrigin(0);
        this.cameras.main.setViewport(this.parent.x, this.parent.y, this.width, this.height);

        var self = this;

        const style2 = {
            fontFamily: '"Roboto Condensed"',
            fontSize: "20px",
            backgroundColor: '#f00',
            "text-transform": "uppercase"
        }

        this.gameinstance.getHeros((heros) => {
            heros.forEach(type => {
                if (type === "mage") {
                    this.addHeroCard(type, 445);
                } else if (type === "archer") {
                    this.addHeroCard(type, 330);
                } else if (type === "warrior") {
                    this.addHeroCard(type, 215);
                } else if (type === "dwarf") {
                    this.addHeroCard(type, 100);
                }
            });
        })

        //Options
        var optionsIcon = this.add.image(55, 40, 'optionsicon').setInteractive();
        optionsIcon.setScale(0.2)
        optionsIcon.on('pointerdown', function (pointer) {
            this.scene.bringToTop('Options')
            this.scene.wake('Options')
        }, this);

        // chat window
        this.chatButton = this.add.image(775, 565, 'chaticon').setScale(0.3)
        this.chatButton.setInteractive();
        this.chatButton.on('pointerdown', function (pointer) {
            console.log(this.scene, ' in overlay')
            if (this.scene.isVisible('chat')) {
                WindowManager.destroy(this, 'chat');
            }
            else {
                console.log(self.gameinstance)
                this.tweens.add({
                    targets: this.chatButton,
                    alpha: 0.3,
                    duration: 350,
                    ease: 'Power3',
                    yoyo: true
                });
                WindowManager.create(this, 'chat', Chat, { controller: self.gameinstance });
            }
        }, this);

        // end turn button
        this.endTurnButton = this.add.image(900, 565, 'endturnicon').setScale(0.3)
        this.endTurnButton.on('pointerdown', function (pointer) {
            // if (this.gameinstance.myTurn) {
            this.gameinstance.endTurn();
            // Todo: Tween will trigger whether or not it is your turn, not sure if we want to change that
            this.tweens.add({
                targets: this.endTurnButton,
                alpha: 0.3,
                duration: 350,
                ease: 'Power3',
                yoyo: true
            });

            // }
        }, this)

        // end day setup
        this.endDaySetup();

        // Add rexUI scrollable panel to serve as game log
        var panelBg = new RoundRectangle(this, 0, 0, 2, 2, 5, this.COLOR_PRIMARY);
        var panelChild = new FixWidthSizer(this, {
            space: {
                left: 2,
                right: 2,
                top: 2,
                bottom: 2,
                item: 3,
                line: 3,
            }
        });
        var panelTrack = new RoundRectangle(this, 0, 0, 10, 5, 5, this.COLOR_DARK);
        var panelThumb = new RoundRectangle(this, 0, 0, 0, 0, 8, this.COLOR_LIGHT);

        var panelConfig = {
            x: 170,
            y: 545,
            width: 300,
            height: 70,
            scrollMode: 0,
            background: this.add.existing(panelBg),
            panel: {
                child: this.add.existing(panelChild),
                mask: {
                    padding: 1
                },
            },
            slider: {
                track: this.add.existing(panelTrack),
                thumb: this.add.existing(panelThumb),
            },
            space: {
                left: 3,
                right: 3,
                top: 3,
                bottom: 3,
                panel: 3,
            }
        }

        var panel = new ScrollablePanel(this, panelConfig).layout();
        this.add.existing(panel);
        this.updatePanel(panel, this.content);

        this.gameinstance.getCurrPlayersTurn(function(hk: string) {
            self.updateContent(panel, `It is the ${hk}'s turn.`)
        })
      
        // Listen for updates to log from server
        this.gameinstance.updateGameLog(function(update: string) {
            self.updateContent(panel, update);
        })

        // TODO: REMOVE LATER, FOR TESTING NARRATOR ONLY
        // var advance = this.add.text(400, 560, "ADVANCE NARRATOR", style2).setInteractive()
        // advance.on('pointerdown', function (pointer) {
        //     this.gameinstance.advanceNarrator();
        // }, this)

        console.log("finished overlay create()")
    }

    private updateContent(panel: ScrollablePanel, update: string) {
        this.content += `\n > ${update}`;
        this.updatePanel(panel, this.content);
        panel.scrollToBottom();
    }

    private updatePanel(panel: ScrollablePanel, content: string) {
        var sizer = panel.getElement('panel');
        var scene = panel.scene;
    
        sizer.clear(true);
        var lines = content.split('\n');
        for (var li = 0, lcnt = lines.length; li < lcnt; li++) {
            var words = lines[li].split(' ');
            for (var wi = 0, wcnt = words.length; wi < wcnt; wi++) {
                sizer.add(
                    scene.add.text(0, 0, words[wi], {
                        fontSize: 10,
                        color: '#000000'
                    })
                );
            }
            if (li < (lcnt - 1)) {
                sizer.addNewLine();
            }
        }
    
        panel.layout();
        return panel;
    }
    
    // Game log content
    // TODO: save up to n messages in the log, clear previous messages.
    private content = 
    `View in game updates here:\n > The legend begins.`;

    private endDaySetup() {
        var self = this;

        var style2 = {
            fontFamily: '"Roboto Condensed"',
            fontSize: "20px",
            backgroundColor: '#f00'
        }

        // end day button
        this.endDayButton = this.add.image(650, 565, 'enddayicon').setScale(0.3)
        this.endDayButton.on('pointerdown', function (pointer) {
            // Deprecated: removed turn logic from frontend
            // does nothing if not your turn
            // if (!self.gameinstance.getTurn()) {
            //     console.log("cannot end your day when it is not your turn");
            //     return;
            // }
            this.tweens.add({
                targets: this.endDayButton,
                alpha: 0.3,
                duration: 350,
                ease: 'Power3',
                yoyo: true
            });
            self.gameinstance.endDay(function (all: boolean) {
                // Update this client's turn state
                // Deprecated: removed turn logic from frontend
                // self.gameinstance.endTurnOnEndDay();
                // the last client to end their day triggers end of day actions for everyone
                if (all) {
                    self.gameinstance.moveMonstersEndDay();
                    // Reset wells
                    self.gameinstance.resetWells(replenishWellsClient);
                }
            });
        }, this);

        // Callbacks
        // Server handles logic for whose hours are getting reset
        // self.gameinstance.receiveResetHours(resetHeroHours);

        self.gameinstance.receiveUpdatedMonsters(moveMonstersOnMap);
        function moveMonstersOnMap(updatedMonsters) {
            console.log("Received updated monsters from server");
            self.moveMonstersEndDay(updatedMonsters);
        }

        self.gameinstance.receiveKilledMonsters(deleteKilledMonsters);
        function deleteKilledMonsters(killedMonster) {
            self.removeKilledMonsters(killedMonster)
        }

        self.gameinstance.fillWells(replenishWellsClient);
        function replenishWellsClient(replenished: number[]) {
            console.log("well tile ids to replenish:", replenished);
            for (let id of replenished) {
                self.wells.get("" + id).fillWell();
            }
        }

        self.gameinstance.receiveResetHours(resetHeroHours);
        function resetHeroHours(resetHoursHk: string, firstEndDay: boolean) {
            console.log("resetting hourtracker for", resetHoursHk, firstEndDay)
            // Note: we don't keep track of hero hours on client, so only need to update 
            // visual hourTracker
            var hk;
            switch (resetHoursHk) {
                case "archer":
                    hk = HeroKind.Archer;
                    break;
                case "dwarf":
                    hk = HeroKind.Dwarf;
                    break;
                case "mage":
                    hk = HeroKind.Mage;
                    break;
                default:
                    hk = HeroKind.Warrior;
            }
            self.hourTracker.reset(hk, firstEndDay);
        }
    }


    private moveMonstersEndDay(updatedMonsters) {
        for (const [mName, newTileID] of Object.entries(updatedMonsters)) {
            let newTile = this.tiles[newTileID as number];
            this.monsterMoveTween(this.monsterNameMap[mName], newTile, newTile.x, newTile.y);
            if (mName == "gor_herb") {
                // Move the herb
                this.herbMoveTween(this.herb, newTile.x, newTile.y)
            }
        }
    }

    private removeKilledMonsters(m) {
        let monster = this.monsterNameMap[m]
        monster.tile.monster = null
        monster.destroy()
        this.monsterNameMap[m] = null
    }

    public monsterMoveTween(monster: Monster, newTile: Tile, newX, newY) {
        this.tweens.add({
            targets: monster,
            x: newX + mOffset,
            y: newY,
            duration: 1000,
            ease: 'Power2',
            // completeDelay: 1000,
            onComplete: function () { monster.moveToTile(newTile) }
        });
    }

    public herbMoveTween(herb: Phaser.GameObjects.Image, newX, newY) {
        this.tweens.add({
            targets: herb,
            x: newX + mOffset + 20,
            y: newY,
            duration: 1000,
            ease: 'Power2',
            completeDelay: 1000,
            onComplete: function () { 
                herb.x = newX + mOffset + 20,
                herb.y = newY
             }
        });
    }

    public setHerb(herb: Phaser.GameObjects.Image) {
        this.herb = herb;
    }

    public toggleInteractive(interactive: boolean) {
        if (interactive) {
            this.endTurnButton.setInteractive();
            this.endDayButton.setInteractive();
            this.heroButtons.forEach(function (button) {
                button.setInteractive();
            })
        } else {
            console.log(this.endTurnButton)
            this.endTurnButton.disableInteractive();
            this.endDayButton.disableInteractive();
            this.heroButtons.forEach(function (button) {
                button.disableInteractive();
            })
        }
    }
}