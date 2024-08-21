var COLS = 10, ROWS = 20, VIRTUAL_ROWS = 4;
var TOTAL_ROWS = ROWS + VIRTUAL_ROWS;
var board = [];
var lose;
var interval;
var intervalRender;
var current; // current moving shape
var currentX = 5;
var currentY;
var freezed; // is current shape settled on the board?
var shapes = [
    [ 1, 1, 1, 1 ],
    [ 1, 1, 1, 0,
      1 ],
    [ 1, 1, 1, 0,
      0, 0, 1 ],
    [ 1, 1, 0, 0,
      1, 1 ],
    [ 1, 1, 0, 0,
      0, 1, 1 ],
    [ 0, 1, 1, 0,
      1, 1 ],
    [ 0, 1, 0, 0,
      1, 1, 1 ]
];
var colors = [
    "rgba(236, 76, 40, 0.75)",
    "rgba(251, 148, 57, 0.75)",
    "rgba(255, 210, 70, 0.75)",
    "rgba(120, 210, 55, 0.75)",
    "rgba(34, 146, 79, 0.75)",
    "rgba(27, 72, 135, 0.75)",
    "rgba(45, 115, 245, 0.75)",
];
var direction = 1;
var score = 0;
var intervalSpeed = 1000; // ms
var ghostBlock;
var ghostBlockX = 0;
var ghostBlockY = 0;
var currentTurn = 0;

// creates a new 4x4 shape in global variable 'current'
// 4x4 so as to cover the size when the shape is rotated
function newShape() {
    var id = Math.floor( Math.random() * shapes.length );
    var shape = shapes[ id ]; // maintain id for color filling

    current = [];
    for ( var y = 0; y < 4; ++y ) {
        current[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            var i = 4 * y + x;
            if ( typeof shape[ i ] != 'undefined' && shape[ i ] ) {
                current[ y ][ x ] = id + 1;
            }
            else {
                current[ y ][ x ] = 0;
            }
        }
    }
    
    // new shape starts to move
    freezed = false;
    // position where the shape will evolve
    currentY = 0;

    while (!valid()) {
        if (direction == -1) {
            currentX++
        } else {
            currentX--;
        }
    }
}

// clears the board
function init() {
    for ( var y = 0; y < ROWS + VIRTUAL_ROWS; ++y ) {
        board[ y ] = [];
        for ( var x = 0; x < COLS; ++x ) {
            board[ y ][ x ] = 0;
        }
    }
}

// keep the element moving down, creating new shapes and clearing lines
function tick() {
    // if the element settled
    if (!valid(0,1)) {
        freeze();
        valid(0, 1);
        clearLines();
        if (lose) {
            clearAllIntervals();
            return false;
        }
        newShape();
    } else {
        if (!valid(direction)) {
            direction *= -1;
        }
        if (direction === 1) {
            ++currentX;
        } else if (direction === -1) {
            --currentX;
        }
    }
    updateGhostBlock();
}

function updateGhostBlock() {
    ghostBlock = current;
    ghostBlockX = currentX;
    ghostBlockY = 0;
    var iterations = 0;
    while (ghostBlockValid()) {
        ghostBlockY++;
        iterations++;
        if (iterations > 25) {
            console.log(iterations);
            break; // TODO remove this when bug cause is found. We don't want to freeze the game for the ghost blocks' sake
        }
    }
}


// stop shape at its position and fix it to board
function freeze() {
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
            }
        }
    }
    freezed = true;
}

// returns rotates the rotated shape 'current' perpendicularly anticlockwise
function rotate( current ) {
    var newCurrent = [];
    for ( var y = 0; y < 4; ++y ) {
        newCurrent[ y ] = [];
        for ( var x = 0; x < 4; ++x ) {
            newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
        }
    }
    updateGhostBlock();

    return newCurrent;
}

// check if any lines are filled and clear them
function clearLines() {
    var linesCleared = 0;
    for ( var y = ROWS - 1 + VIRTUAL_ROWS; y >= 0; --y ) {
        var rowFilled = true;
        for ( var x = 0; x < COLS; ++x ) {
            if ( board[ y ][ x ] == 0 ) {
                rowFilled = false;
                break;
            }
        }
        if ( rowFilled ) {
            linesCleared++;
            document.getElementById( 'clearsound' ).play();
            for ( var yy = y; yy > 0; --yy ) {
                for ( var x = 0; x < COLS; ++x ) {
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                }
            }
            ++y;
        }
    }
    updateScore(linesCleared);
}

function updateScore(linesCleared) {
    score += [0, 40, 100, 300, 1000][linesCleared] || 0;
}

function keyPress( key ) {
    switch ( key ) {
        case 'rotate':
            var rotated = rotate( current );
            if ( valid( 0, 0, rotated ) ) {
                current = rotated;
                updateGhostBlock();
            }
            break;
        case 'drop':
            while( valid(0, 1) ) {
                ++currentY;
            }
            clearInterval( interval );
            currentTurn++;
            intervalSpeed = Math.max(100, (-1 * 400 / 30) * currentTurn + 500); // Fall from 1000ms turn 1 to 100ms turn 20 and stay at 100ms.
            console.log(intervalSpeed);
            interval = setInterval( tick, intervalSpeed );
            tick();
            break;
    }
}

// checks if the resulting position of current shape will be feasible
function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;

    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( newCurrent[ y ][ x ] ) {
                if ( typeof board[ y + offsetY ] == 'undefined'
                  || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                  || board[ y + offsetY ][ x + offsetX ]
                  || x + offsetX < 0
                  || y + offsetY >= ROWS + VIRTUAL_ROWS
                  || x + offsetX >= COLS ) {
                    if (offsetY <= 5 && freezed) {
                        lose = true; // lose if the current shape is settled at the top most row
                        document.getElementById('playbutton').disabled = false;
                    } 
                    return false;
                }
            }
        }
    }
    return true;
}

function ghostBlockValid() {
    let offsetX = ghostBlockX;
    let offsetY = ghostBlockY + 1;

    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( ghostBlock[ y ][ x ] ) {
                if ( typeof board[ y + offsetY ] == 'undefined'
                  || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                  || board[ y + offsetY ][ x + offsetX ]
                  || x + offsetX < 0
                  || y + offsetY >= ROWS + VIRTUAL_ROWS
                  || x + offsetX >= COLS ) {
                    return false;
                }
            }
        }
    }
    return true;
}

function playButtonClicked() {
    newGame();
    document.getElementById("playbutton").disabled = true;
}

function newGame() {
    clearAllIntervals();
    intervalRender = setInterval( render, 30 );
    init();
    newShape();
    updateGhostBlock();
    lose = false;
    interval = setInterval( tick, intervalSpeed );
}

function clearAllIntervals(){
    clearInterval( interval );
    clearInterval( intervalRender );
}