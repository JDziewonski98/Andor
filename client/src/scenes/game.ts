import { Tile } from '../objects/tile';
import { Farmer } from '../objects/farmer';
import { Hero } from '../objects/hero';
import { HourTracker } from '../objects/hourTracker';
import { game } from '../api';
import { WindowManager } from "../utils/WindowManager";
import { CollabWindow } from './collabwindow';
import {
  expandedWidth, expandedHeight, borderWidth,
  fullWidth, fullHeight, htX, htY, scaleFactor,
  mageTile, archerTile, warriorTile, dwarfTile,
  reducedWidth, reducedHeight,
  collabTextHeight, collabColWidth, collabRowHeight,
  wellTile1, wellTile2, wellTile3, wellTile4
} from '../constants'
import { MerchantWindow } from './merchantwindow';
import { Monster } from '../objects/monster';
import { Fight} from './fightwindow';
import { HeroKind } from '../objects/HeroKind';
import { RietburgCastle } from './rietburgcastle';


export default class GameScene extends Phaser.Scene {
  private heroes: Hero[];
  private hero: Hero;
  private ownHeroType: HeroKind;
  private tiles: Tile[];
  private welltiles: Tile[];
  private farmers: Farmer[];
  private hourTracker: HourTracker;
  private gameinstance: game;
  private monsters: Monster[]
  private castle:RietburgCastle;

  private gameText;

  private cameraKeys;
  private cameraScrollSpeed = 15;
  private minZoom = 0.4;
  private maxZoom = 1;
  private zoomAmount = 0.01;

  private sceneplugin

  constructor() {
    super({ key: 'Game' });
    // this.heroes = Array<Hero>(4); // This is adding 4 dummy elements at the start
    this.heroes = Array<Hero>();
    this.tiles = Array<Tile>();
    this.farmers = new Array<Farmer>();
    this.ownHeroType = HeroKind.Dwarf;
    this.monsters = new Array<Monster>();
    this.castle = new RietburgCastle();

  }

  public init(data) {
    this.gameinstance = data.controller;
    let type = data.heroType;
    console.log("GameScene created, client hero type: ", type);
    if (type === "dwarf")
    {
      this.ownHeroType = HeroKind.Dwarf
      //This will need to be moved when we implement loading and saving, but for now this is fine.
      this.gameinstance.setMyTurn(true)
    }
    else if (type === "warrior")
      this.ownHeroType = HeroKind.Warrior
    else if (type === "mage")
      this.ownHeroType = HeroKind.Mage
    else if (type === "archer")
      this.ownHeroType = HeroKind.Archer
    this.sys.game.scene.bringToTop('BoardOverlay');
  }

  public preload() {
    this.load.image("gor", "../assets/gor.PNG")
    this.load.image("skral", "../assets/skral.PNG")
    this.load.image("wardrak", "../assets/wardrak.PNG")
    this.load.image("farmer", "../assets/farmer.png");
    this.load.multiatlas('tiles', './assets/tilesheet.json', 'assets')
    // TODO: Create a sprite sheet for heroes as well so they don't need an 
    // internal sprite to render their image
    this.load.image("well", "../assets/well.png");
  }

  public create() {
    this.cameraSetup();
    this.sceneplugin = this.scene
    // Centered gameboard with border
    this.add.image(fullWidth / 2, fullHeight / 2, 'gameboard')
      .setDisplaySize(expandedWidth, expandedHeight);

    this.sys.game.scene.bringToTop('BoardOverlay');

    this.setRegions();

    var self = this;
    var numPlayer = 0;
    this.gameinstance.getHeros((herotypes) => {
      herotypes.forEach(type => {
        if (type === "archer") {
          self.addHero(HeroKind.Archer, archerTile, "archermale");
        } else if (type === "mage") {
          self.addHero(HeroKind.Mage, mageTile, "magemale");
        } else if (type === "warrior") {
          self.addHero(HeroKind.Warrior, warriorTile, "warriormale");
        } else if (type === "dwarf") {
          self.addHero(HeroKind.Dwarf, dwarfTile, "dwarfmale");
        }
      });

      // Need to wait for heroes to be created before creating collab decision
      self.startingCollabDecisionSetup();
      this.hourTrackerSetup();
    })
    console.log(numPlayer);

    this.addMerchants();
    this.addFarmers()
    this.addMonsters()
    this.addSheildsToRietburg()
    
    


      // x and y coordinates
      this.addWell(209,2244, wellTile1, "well1")
      this.addWell(1353,4873, wellTile2, "well2")
      this.addWell(7073, 3333, wellTile3, "well3")
      this.addWell(5962, 770, wellTile4, "well4")

      this.gameinstance.yourTurn()

      this.addGold()

    // self.startingCollabDecisionSetup();
  }

  private cameraSetup() {
    // Set bounds of camera to the limits of the gameboard
    var camera = this.cameras.main;
    camera.setBounds(0, 0, fullWidth, fullHeight);
    // Set keys for scrolling
    // Set keys for scrolling and zooming
    this.cameraKeys = this.input.keyboard.addKeys({
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right',
      zoomIn: 'plus',
      zoomOut: 'minus'
    });
  }        
    

  private setRegions() {
    // Note that regions 73-79 and 83 are unused, but created anyways to preserve direct
    // indexing between regions array and region IDs
    var tilesData = require("../utils/xycoords").map;
    var treeTile = this.textures.get('tiles').getFrameNames()[12];
    for (var element in tilesData) {
      var tile = new Tile(element, this, tilesData[element].xcoord * scaleFactor + borderWidth, tilesData[element].ycoord * scaleFactor + borderWidth, treeTile);
      this.tiles[element] = tile;
      tile.setInteractive();
      this.add.existing(tile);
    }

    /// for movement callback, ties pointerdown to move request
    var self = this
    this.tiles.map(function (tile) {
      tile.on('pointerdown', function () {
        console.log("It is my turn: ", self.gameinstance.myTurn)
        self.gameinstance.moveRequest(tile.id, updateMoveRequest)
      })
    })

    this.gameinstance.updateMoveRequest(updateMoveRequest)

    function updateMoveRequest(heroKind, tileID) {
      self.heroes.forEach((hero: Hero) => {
        if (hero.getKind().toString() === heroKind) {
          hero.moveTo(self.tiles[tileID])
        }
      })
    }

  }

  private addSheildsToRietburg(){
    let s1 = this.add.sprite(85, 190, '8bit_herb').setDisplaySize(40,40)
    let s2 = this.add.sprite(155, 190, '8bit_herb').setDisplaySize(40,40)
    let s3 = this.add.sprite(225, 190, '8bit_herb').setDisplaySize(40,40)
    let s4 = this.add.sprite(85, 310, '8bit_herb').setDisplaySize(40,40)
    let s5 = this.add.sprite(155, 310, '8bit_herb').setDisplaySize(40,40)
    let s6 = this.add.sprite(85, 430, '8bit_herb').setDisplaySize(40,40)

    this.castle.sheilds.push(s1)
    this.castle.sheilds.push(s2)
    this.castle.sheilds.push(s3)
    this.castle.sheilds.push(s4)
    this.castle.sheilds.push(s5)
    this.castle.sheilds.push(s6)
    
    var self = this;

    this.gameinstance.getNumSheilds(function(numSheilds){
      for(var i = 0; i < numSheilds; i++){
        self.castle.sheilds[i].visible = false;
      }
    })
  }

  private addMerchants() {
    const merchtile_18: Tile = this.tiles[18];
    const merchtile_57: Tile = this.tiles[57];
    const merchtile_71: Tile = this.tiles[71];

    var self = this;

    merchtile_18.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == merchtile_18.id) {

        if (this.scene.isVisible('merchant1')) {
          WindowManager.destroy(self, 'merchant1');
        } else {
          WindowManager.create(self, 'merchant1', MerchantWindow, self.gameinstance);
          let window = WindowManager.get(self, 'merchant1')

        }

      }

    }, this);

    merchtile_57.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == merchtile_18.id) {

        if (this.scene.isVisible('merchant2')) {
          WindowManager.destroy(self, 'merchant2');
        } else {
          WindowManager.create(self, 'merchant2', MerchantWindow, self.gameinstance);
          let window = WindowManager.get(self, 'merchant2')
        }

      }

    }, this);

    merchtile_71.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == merchtile_18.id) {

        if (this.scene.isVisible('merchant3')) {
          WindowManager.destroy(self, 'merchant3');
        } else {
          WindowManager.create(self, 'merchant3', MerchantWindow, self.gameinstance);
          let window = WindowManager.get(self, 'merchant3')
        }

      }

    }, this);

  }


  private addMonsters() {

    const gortile1: Tile = this.tiles[8];
    const gortile2: Tile = this.tiles[20];
    const gortile3: Tile = this.tiles[21];
    const gortile4: Tile = this.tiles[26];
    const gortile5: Tile = this.tiles[48];
    const skraltile: Tile = this.tiles[19];

    let gor1: Monster = new Monster(this, gortile1, 'gor', 'gor1').setInteractive().setScale(.5);
    let gor2: Monster = new Monster(this, gortile2, 'gor', 'gor2').setInteractive().setScale(.5);
    let gor3: Monster = new Monster(this, gortile3, 'gor', 'gor3').setInteractive().setScale(.5);
    let gor4: Monster = new Monster(this, gortile4, 'gor', 'gor4').setInteractive().setScale(.5);
    let gor5: Monster = new Monster(this, gortile5, 'gor', 'gor5').setInteractive().setScale(.5);
    let skral: Monster = new Monster(this, skraltile, 'skral', 'skral1').setInteractive().setScale(.5);

    this.monsters.push(gor1);
    this.monsters.push(gor2);
    this.monsters.push(gor3);
    this.monsters.push(gor4);
    this.monsters.push(gor5);
    this.monsters.push(skral);

    gortile1.monster = gor1
    gortile2.monster = gor2
    gortile3.monster = gor3
    gortile4.monster = gor4
    gortile5.monster = gor5
    skraltile.monster = skral

    this.monsters.forEach(monster =>
      this.add.existing(monster)
    );

    for (let i = 0; i < this.monsters.length; i++) {

      this.monsters[i].on('pointerdown', function (pointer) {
        if (this.scene.isVisible(this.monsters[i].name)) {
          WindowManager.destroy(this, this.monsters[i].name);
        }
        else {
          WindowManager.create(this, this.monsters[i].name, Fight, {
            controller: this.gameinstance, monstertexture: this.monsters[i].texture,
            hero: this.hero, monstername: this.monsters[i].name
          });
        }
      }, this)
    }

  }

  private addFarmers() {

    const farmertile_0: Tile = this.tiles[24];
    const farmertile_1: Tile = this.tiles[36];

    let farmer_0: Farmer = new Farmer(0,this, farmertile_0, 'farmer').setDisplaySize(40, 40);
    let farmer_1: Farmer = new Farmer(1, this, farmertile_1, 'farmer').setDisplaySize(40, 40);

    // var gridX1 = farmertile_0.farmerCoords[0][0];
    // var gridY1 = farmertile_0.farmerCoords[0][1];

    // var gridX2 = farmertile_1.farmerCoords[1][0];
    // var gridY2 = farmertile_1.farmerCoords[1][1];

    // var farmerIcon1 = this.add.sprite(gridX1, gridY1, 'farmer').setDisplaySize(40, 40);
    // var farmerIcon2 = this.add.sprite(gridX2, gridY2, 'farmer').setDisplaySize(40, 40);

    // let farmer_0: Farmer = new Farmer(this, farmertile_0, farmerIcon1).setDisplaySize(40, 40);
    // let farmer_1: Farmer = new Farmer(this, farmertile_1, farmerIcon2).setDisplaySize(40, 40);

    farmer_0.setInteractive();
    farmer_1.setInteractive();

    this.farmers.push(farmer_0);
    this.farmers.push(farmer_1);

    farmertile_0.farmer.push(farmer_0);
    farmertile_0.farmerexist = true;
    farmertile_1.farmer.push(farmer_1);
    farmertile_1.farmerexist = true;

    this.add.existing(farmer_0);
    this.add.existing(farmer_1);

    var self = this;

    farmer_0.on('pointerdown', function (pointer) {
      //if (self.hero.tile.id == self.farmers[0].tile.id) {
        self.gameinstance.pickupFarmer(function (tileid) {
          let pickedFarmer:Farmer = self.tiles[tileid].farmer.pop();
          for( var i = 0; i < 2; i++){
            if(self.farmers[i].id === pickedFarmer.id){
              self.farmers[i].tile = undefined;
              self.hero.farmers.push(pickedFarmer)
              break;
            }
          }
          pickedFarmer.destroy()
          console.log(self.hero.farmers)
       });
      //}

    }, this);

    farmer_1.on('pointerdown', function (pointer) {
      if (self.hero.tile.id == self.farmers[1].tile.id) {
        self.gameinstance.pickupFarmer(function (tileid) {
          let pickedFarmer:Farmer = self.tiles[tileid].farmer.pop();
          for( var i = 0; i < 2; i++){
            if(self.farmers[i].id === pickedFarmer.id){
              self.farmers[i].tile = undefined;
              self.hero.farmers.push(pickedFarmer)
              break;
            }
          }
          pickedFarmer.destroy()
          console.log(self.hero.farmers)
       });
      }

    }, this);


    this.gameinstance.destroyFarmer(function (tileid) {
      let pickedFarmer:Farmer = self.tiles[tileid].farmer.pop();
      for( var i = 0; i < 2; i++){
        if(self.farmers[i] === pickedFarmer){
          self.farmers[i].tile = undefined;
          console.log(self.farmers[i].tile)
          break;
        }
      }
      pickedFarmer.destroy()
      
    });

    this.gameinstance.addFarmer(function (tileid, farmerid) {
      if(tileid === 0){
        let newFarmer = self.hero.farmers.pop()
        for(var i = 0; i < 6; i++){
          if(self.castle.sheilds[i].visible == true){
            self.castle.sheilds[i].visible = false;
            break;
          }
        }
        
      }else{
        let newFarmer = self.hero.farmers.pop()
        
        if(farmerid === 0){
          newFarmer = new Farmer(0, self, self.tiles[tileid], 'farmer').setDisplaySize(40,40)
        }else if(farmerid === 1){
          newFarmer = new Farmer(1, self, self.tiles[tileid], 'farmer').setDisplaySize(40,40)
        }

        self.tiles[tileid].farmer.push(newFarmer)

        newFarmer.setInteractive()

        newFarmer.on('pointerdown', function (pointer) {
          //if (self.hero.tile.id == self.farmers[0].tile.id) {
            self.gameinstance.pickupFarmer(function (tileid) {
              let pickedFarmer:Farmer = self.tiles[tileid].farmer.pop();
              for( var i = 0; i < 2; i++){
                if(self.farmers[i].id === pickedFarmer.id){
                  self.farmers[i].tile = undefined;
                  self.hero.farmers.push(pickedFarmer)
                  break;
                }
              }
              pickedFarmer.destroy()
              console.log(self.hero.farmers)
          });
          //}
    
        }, this);
        self.add.existing(newFarmer)
      }
      });
  
  }

  private addHero(type: HeroKind, tileNumber: number, texture: string) {
    const tile: Tile = this.tiles[tileNumber]
    let hero: Hero = new Hero(this, tile, texture, type).setDisplaySize(40, 40);
    this.heroes.push(hero);
    tile.hero = hero;
    this.add.existing(hero);
    if (this.ownHeroType === type) {
      this.hero = hero;
    }
  }



  private addWell(x, y, tileNumber: number, wellName: string) {
    const tile: Tile = this.tiles[tileNumber]
    const well = this.add.image(x * scaleFactor + borderWidth, y * scaleFactor + borderWidth, "well").setDisplaySize(50, 40)
    well.name = wellName;


        well.setInteractive()
        this.add.existing(well);
        var self = this

        well.on("pointerdown", function (pointer) {
            //console.log(tile.hero.getWillPower())
            self.gameinstance.useWell(function () {

                well.setTint(0x404040)

                //assumes tile has only 1 hero NEED TO FIX
                if (tile.hero.getWillPower() <= 17) {
                    tile.hero.setwillPower(3)
                }
                else if (tile.hero.getWillPower() <= 20 && tile.hero.getWillPower() > 17) {
                    tile.hero.setwillPower(20 - tile.hero.getWillPower())
                }
            });
        }, this);

        this.gameinstance.updateWell(function (pointer) {
            self[wellName].setTint(0x404040)
            if (tile.hero.getWillPower() <= 17) {
                tile.hero.setwillPower(3)
            }
            else if (tile.hero.getWillPower() <= 20 && tile.hero.getWillPower() > 17) {
                tile.hero.setwillPower(20 - tile.hero.getWillPower())
            }
        }, this);

        well.setInteractive()
        var self = this


        well.on("pointerdown", function () {
            //console.log(tile.hero.getWillPower())
            self.gameinstance.useWell(function () {
                self[wellName].setTint(0x404040)

                if (tile.hero.getWillPower() <= 17) {
                    tile.hero.setwillPower(3)
                }
                else if (tile.hero.getWillPower() <= 20 && tile.hero.getWillPower() > 17) {
                    tile.hero.setwillPower(20 - tile.hero.getWillPower())
                }
            })
        })
    }

    private addGold() {       
        var self = this        
        for (var id in self.tiles) {
            console.log(id, this)

            if (self.tiles[id].getGold() !== 0) {
                //create a text Sprite indicating the number of gold. 
                var goldText = this.add.text(50, 50, "G", { color: "#fff52e" }).setX(self.tiles[id].x + 20).setY(self.tiles[id].y + 20)
                //set to interactive
                goldText.setInteractive() 
                this.add.existing(goldText);                
                

                goldText.on("pointerdown", function (pointer) {   
                    /*console.log("pickup attempt") //is printed
                    console.log(goldText)
                    console.log(self.tiles[id].getGold())*/
                    self.gameinstance.pickupGold(function () {                        
                        if (self.tiles[id].getGold() > 0) {
                            console.log(self.tiles[id].getGold())
                            self.tiles[id].setGold(self.tiles[id].getGold() - 1)
                            //const newString = String()
                            //goldText.setText("" + self.tiles[id].getGold()
                        } 
                    })                                                
                   
                },this)

                self.gameinstance.updatePickupGold(function (pointer) {
                    if (self.tiles[id].getGold() > 0) {
                        console.log(self.tiles[id].getGold())
                        self.tiles[id].setGold(self.tiles[id].getGold() - 1)                        
                    } 
                }, this)
            }
        }
    }



  private startingCollabDecisionSetup() {
    var self = this;

    var style2 = {
      fontFamily: '"Roboto Condensed"',
      fontSize: "20px",
      backgroundColor: '#f00'
    }

    // Start of game collab decision
    /* For testing purposes: open and close a collab window using interactive text on game
    this.gameText = this.add.text(600, 550, "COLLAB", style2).setOrigin(0.5)
    this.gameText.setInteractive();
    this.gameText.on('pointerdown', function (pointer) {
      if (this.scene.isVisible('collab')) {
        WindowManager.destroy(this, 'collab');
        return;
      }

      // Move definition and creation of collab window here for testing
    }, this);
    */

    // TODO collab: Replace all this hardcoding UI shit with something nicer
    // var res = { "gold": 5, "wineskin": 2 };
    var res = new Map([
      ["gold", 5], 
      ["wineskin", 2]
    ])
    // Determine width of the window based on how many resources are being distributed
    var width = (res.size + 1) * collabColWidth; // Not sure if there's a better way of getting size of ts obj
    // Determine height of the window based on number of players involved
    var height = (self.heroes.length + 2) * collabRowHeight;
    // Set data depending on whether the client is the owner of the decision
    // Get hero of lowest rank, based on their starting tile
    var heroRanks = [];
    for (let hero of self.heroes) { heroRanks.push(hero.tile.id); }
    console.log(heroRanks);
    var startingHeroRank = Math.min(...heroRanks);
    console.log("starting hero rank is", startingHeroRank);
    var collabWindowData = (self.hero.tile.id == startingHeroRank) ?
      {
        controller: self.gameinstance,
        isOwner: true,
        heroes: self.heroes,
        resources: res,
        textOptions: null,
        x: reducedWidth / 2 - width / 2,
        y: reducedHeight / 2 - height / 2,
        w: width,
        h: height
      } :
      {
        controller: self.gameinstance,
        isOwner: false,
        x: reducedWidth / 2 - width / 2,
        y: reducedHeight / 2 - height / 2,
        w: 200,
        h: 100
      }
    WindowManager.create(this, 'collab', CollabWindow, collabWindowData);
    // Freeze main game while collab window is active
    this.scene.pause();
  }

  // Creating the hour tracker
  private hourTrackerSetup() {
    //x, y coorindates
    var htx = htX;
    var hty = htY;
    // Hero icons
    // var mageHtIcon = this.add.sprite(htx, hty, 'magemale').setDisplaySize(40, 40);
    // var dwarfHtIcon = this.add.sprite(htx, hty, 'dwarfmale').setDisplaySize(40, 40);
    // var archerHtIcon = this.add.sprite(htx, hty, 'archermale').setDisplaySize(40, 40);
    // var warriorHtIcon = this.add.sprite(htx, hty, 'warriormale').setDisplaySize(40, 40);
    
    var self = this
    var heroSprites = []
    for(var h of this.heroes){
      console.log(h)
      var sprite = self.add.sprite(htx, hty, h.texture.key).setDisplaySize(40, 40)
      heroSprites[h.getKind()] = sprite
      switch (h.getKind()) {
        case HeroKind.Archer:
            sprite.x = htx - 20
            sprite.y = hty - 20
            break
        case HeroKind.Dwarf:
            sprite.x = htx + 20
            sprite.y = hty - 20
            break
        case HeroKind.Mage:
            sprite.x = htx - 20
            sprite.y = hty + 20
            break
        case HeroKind.Warrior:
            sprite.x = htx + 20
            sprite.y = hty + 20
            break
    }
    }
    this.hourTracker = new HourTracker(this, htx, hty, heroSprites);

    // we're not actually adding the hourTracker, we're adding it's internal sprite
    this.hourTracker.depth = 5;
    this.hourTracker.depth = 0;
    for (var h of this.heroes) {
      h.hourTracker = this.hourTracker;
    }

    this.hourTracker.setInteractive();
  }

  public update() {
    var camera = this.cameras.main;

    // Scroll updates
    if (this.cameraKeys["up"].isDown) {
      camera.scrollY -= this.cameraScrollSpeed;
    } else if (this.cameraKeys["down"].isDown) {
      camera.scrollY += this.cameraScrollSpeed;
    }

    if (this.cameraKeys["left"].isDown) {
      camera.scrollX -= this.cameraScrollSpeed;
    } else if (this.cameraKeys["right"].isDown) {
      camera.scrollX += this.cameraScrollSpeed;
    }

    // Zoom updates
    if (this.cameraKeys["zoomIn"].isDown && camera.zoom < this.maxZoom) {
      camera.zoom += this.zoomAmount;
    } else if (this.cameraKeys["zoomOut"].isDown && camera.zoom > this.minZoom) {
      camera.zoom -= this.zoomAmount;
    }

    //this.gameinstance.yourTurn()
  }

}