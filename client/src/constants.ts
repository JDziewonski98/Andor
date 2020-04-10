// Scaling factor of game board
export var scaleFactor = .25;

// Window game size
export var reducedWidth = 1000;
export var reducedHeight = 600;

// Gameboard jpg size
export var borderWidth = 40;
export var expandedWidth = 9861*scaleFactor;
export var fullWidth = expandedWidth+borderWidth*2;
export var expandedHeight = 6476*scaleFactor;
export var fullHeight = expandedHeight+borderWidth*2;

// Positioning of HourTracker
export var htX = 4600*scaleFactor+borderWidth;
export var htY = 250*scaleFactor+borderWidth;
export var htShift = 415*scaleFactor;

// Monster position offset
export var mOffset = -40;

// SETUP
export const dwarfTile = 7;
export const archerTile = 25;
export const warriorTile = 14;
export const mageTile = 34;

// Collab window UI
export const collabTextHeight = 12;
export const collabRowHeight = 50;
export const collabColWidth = 70;

// Well tile IDs
export const wellTile1 = 5;
export const wellTile2 = 35;
export const wellTile3 = 45;
export const wellTile4 = 55;

// fog tile IDs
export const fogs = [8, 11, 12, 13, 49, 16, 32, 48, 42, 44, 47, 46, 64, 56, 63];


// narrator image's X-coord is a constant
export const narratorXCoord = 9450 * scaleFactor + borderWidth

// not set to const to allow reverse mapping.
export enum enumPositionOfNarrator {
    'A' = 0,
    'B' = 1,
    'C' = 2,
    'D' = 3,
    'E' = 4,
    'F' = 5,
    'G' = 6,
    'H' = 7,
    'I' = 8,
    'J' = 9,
    'K' = 10,
    'L' = 11,
    'M' = 12,
    'N' = 13
};

// Hero card info
export const heroCardInfo = {
    dwarfName: "Kram",
    dwarfDesc: "Dwarf from the deep mines\nRank 7",
    dwarfAbility: "Special ability: Kram can buy strength\npoints at the dwarf mine (space 71) for\n1 gold each instead of 2 gold.",
    
    archerName: "Pasco",
    archerDesc: "Archer from the Watchful Woods\nRank 25",
    archerAbility: "Special ability: Each battle round, Pasco rolls\nhis dice one at a time and decides when to stop\nrolling. Only his final roll counts. He can also\nattack a creature in an adjacent space.",
    
    mageName: "Liphardus",
    mageDesc: "Wizard from the north\nRank 34",
    mageAbility: "Special ability: Each battle round, Liphardus\ncan turn his rolled die onto its opposite side\nimmediately after rolling. When fighting with\nother heroes in a collectibe battle, he can\napply this ability to another hero's roll\ninstead of his own.",
    
    warriorName: "Thorn",
    warriorDesc: "Warrior from Rietland\nRank 14",
    warriorAbility: "Special ability: Thorn gets 5 willpower points\ninstead of 3 when he empties a well."
}

// Narrator story info
export const storyCardWidths = [450, 450, 470]
export const storyCardHeights = [150, 170, 110]
export const storyCardTexts = [
`A gloomy mood has fallen upon the people.
Rumors are making the rounds that skrals have set up
a stronghold in some undiscovered location. 
The heroes have scattered themselves across the 
entire land in search of this location. 
The defense of the castle is in their hands alone.

Many farmers have asked for help and are seeking 
shelter behind the high walls of Rietburg Castle`,

`At first sunlight, the heroes receive a message: 
Old King Brandmur's willposwr seems to have weakened 
with the passage of time. But there is said to be a 
herb growing in the mountain passes that can revive 
a person's life.

Task:
The heroes must heal the king with the medicinal herb.
To do that, they must find the witch. 
Only she know the locations where this herb grows.
The witch is hiding behind one of the fog tokens.`,

`From now on, any articles (in addition to strength points)
may be purchased from the merchants (spaces 18, 57, and 71)
for 2 gold each.
Each hero starts with 2 strength points. The group receives
5 gold and 2 wineskins, how to divide them is up to you.
Best of luck, Andor depends on you!`
]
export const storyCardStyleText = {
    fontSize: 12,
    color: '#000000'
}
export const storyCardStyleTitle = {
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#4B2504'
}