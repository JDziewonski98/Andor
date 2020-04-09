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
import { Prince } from '../objects/Prince';

export default class BoardOverlay extends Phaser.Scene {
    private parent: Phaser.GameObjects.Zone
    private heroButtons: Map<string, Phaser.GameObjects.Text> = new Map();
    private gameinstance: game;
    private endTurnButton: Phaser.GameObjects.Text;
    private chatButton: Phaser.GameObjects.Text;
    private endturntext;
    private clientheroobject;

    // End Day
    private endDayButton: Phaser.GameObjects.Text;
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

    private movePrinceButton: Phaser.GameObjects.Text;

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
    }

    public init() { }

    public preload() {
        this.load.image('hourbar', './assets/hours.PNG')
    }

    private addHeroCard(type, x) {
        const style2 = {
            fontFamily: '"Roboto Condensed"',
            fontSize: "20px",
            backgroundColor: '#f00'
        }
        var self = this;

        this.heroButtons.set(type, this.add.text(x, 10, type, style2));
        this.heroButtons.get(type).on('pointerdown', (pointer) => {
            this.gameinstance.getHeroAttributes(type, (herodata) => {
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
                            ...herodata , 
                            clientherotile: this.clientheroobject.tile.id,
<<<<<<< HEAD
=======
                            name: type,
>>>>>>> Phil initial narrator work
                            x: pointer.x,
                            y: pointer.y+20
                        }
                    );
<<<<<<< HEAD
=======
                    let window = WindowManager.get(this, cardID)
                    window.setName(type)
>>>>>>> Phil initial narrator work
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
                    this.addHeroCard(type, 400);
                } else if (type === "archer") {
                    this.addHeroCard(type, 300);
                } else if (type === "warrior") {
                    this.addHeroCard(type, 200);
                } else if (type === "dwarf") {
                    this.addHeroCard(type, 100);
                }
            });
        })

        //Options
        var optionsIcon = this.add.image(30, 30, 'optionsIcon').setInteractive();
        optionsIcon.setScale(0.5)
        optionsIcon.on('pointerdown', function (pointer) {
            this.scene.bringToTop('Options')
            this.scene.wake('Options')
        }, this);

        // chat window
        this.chatButton = this.add.text(750, 560, "CHAT", style2)
        this.chatButton.setInteractive();
        this.chatButton.on('pointerdown', function (pointer) {
            console.log(this.scene, ' in overlay')
            if (this.scene.isVisible('chat')) {
                WindowManager.destroy(this, 'chat');
            }
            else {
                console.log(self.gameinstance)
                WindowManager.create(this, 'chat', Chat, { controller: self.gameinstance });
            }
        }, this);

        // end turn button
        this.endTurnButton = this.add.text(850, 560, "END TURN", style2)
        this.endTurnButton.on('pointerdown', function (pointer){
            if (this.gameinstance.myTurn) {
                this.gameinstance.endTurn();
                this.tweens.add({
                    targets: this.endTurnButton,
                    alpha: 0.3,
                    duration: 350,
                    ease: 'Power3',
                    yoyo: true
                });

            }
        }, this)

        // end day setup
        this.endDaySetup();

        console.log("finished overlay create()")
    }

    private endDaySetup() {
        var self = this;

        var style2 = {
            fontFamily: '"Roboto Condensed"',
            fontSize: "20px",
            backgroundColor: '#f00'
        }
    
        this.endDayButton = this.add.text(600, 560, "END DAY", style2)
        this.endDayButton.on('pointerdown', function (pointer) {
            // does nothing if not your turn
            if (!self.gameinstance.getTurn()) {
                console.log("cannot end your day when it is not your turn");
                return;
            }

            self.gameinstance.endDay(function (all: boolean) {
                // Update this client's turn state
                self.gameinstance.endTurnOnEndDay();
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
        self.gameinstance.receiveResetHours(resetHeroHours);

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
        function resetHeroHours(resetHoursHk: string) {
            console.log("resetting hourtracker for", resetHoursHk)
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
            self.hourTracker.reset(hk);
        }
    }


    private moveMonstersEndDay(updatedMonsters) {
        for (const [mName, newTileID] of Object.entries(updatedMonsters)) {
            let newTile = this.tiles[newTileID as number];
            this.monsterMoveTween(this.monsterNameMap[mName], newTile, newTile.x, newTile.y);
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
            completeDelay: 1000,
            onComplete: function () { monster.moveToTile(newTile) }
        });

    }

    public toggleInteractive(interactive: boolean) {
        if (interactive) {
            this.endTurnButton.setInteractive();
            this.endDayButton.setInteractive();
            this.heroButtons.forEach(function(button) {
                button.setInteractive();
            })
        } else {
            console.log(this.endTurnButton)
            this.endTurnButton.disableInteractive();
            this.endDayButton.disableInteractive();
            this.heroButtons.forEach(function(button) {
                button.disableInteractive();
            })
        }
    }
}