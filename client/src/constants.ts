// Scaling factor of game board
var scaleFactor = .15;

// Gameboard jpg size
var expandedWidth = 9861*scaleFactor;
var expandedHeight = 6476*scaleFactor;

// Positioning of HourTracker
var htX = 4600*scaleFactor;
var htY = 250*scaleFactor;
var htShift = 415*scaleFactor;

module.exports = {
    scaleFactor,
    expandedHeight, 
    expandedWidth,
    htX,
    htY,
    htShift
};