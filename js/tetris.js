let COLS = 10, ROWS = 20, VIRTUAL_ROWS = 4;
let board = [];
let lose;
let interval;
let intervalRender;
let current; // current moving shape
let currentX, currentY; // position of current shape
let freezed; // is current shape settled on the board?
let shapes = [
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
let colors = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];
let direction = 1;

// creates a new 4x4 shape in global variable 'current'
// 4x4 so as to cover the size when the shape is rotated
function newShape() {
    let id = Math.floor( Math.random() * shapes.length );
    let shape = shapes[ id ]; // maintain id for color filling

    current = [];
    for ( let y = 0; y < 4; ++y ) {
        current[ y ] = [];
        for ( let x = 0; x < 4; ++x ) {
            let i = 4 * y + x;
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
    currentX = 5;
    currentY = 0;
}

// clears the board
function init() {
    for ( let y = 0; y < ROWS + VIRTUAL_ROWS; ++y ) {
        board[ y ] = [];
        for ( let x = 0; x < COLS; ++x ) {
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
}

// stop shape at its position and fix it to board
function freeze() {
    for ( let y = 0; y < 4; ++y ) {
        for ( let x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
            }
        }
    }
    freezed = true;
}

// returns rotates the rotated shape 'current' perpendicularly anticlockwise
function rotate( current ) {
    let newCurrent = [];
    for ( let y = 0; y < 4; ++y ) {
        newCurrent[ y ] = [];
        for ( let x = 0; x < 4; ++x ) {
            newCurrent[ y ][ x ] = current[ 3 - x ][ y ];
        }
    }

    return newCurrent;
}

// check if any lines are filled and clear them
function clearLines() {
    for ( let y = ROWS - 1 + VIRTUAL_ROWS; y >= 0; --y ) {
        let rowFilled = true;
        for ( let x = 0; x < COLS; ++x ) {
            if ( board[ y ][ x ] == 0 ) {
                rowFilled = false;
                break;
            }
        }
        if ( rowFilled ) {
            document.getElementById( 'clearsound' ).play();
            for ( let yy = y; yy > 0; --yy ) {
                for ( let x = 0; x < COLS; ++x ) {
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                }
            }
            ++y;
        }
    }
}

function keyPress( key ) {
    switch ( key ) {
        case 'rotate':
            let rotated = rotate( current );
            if ( valid( 0, 0, rotated ) ) {
                current = rotated;
            }
            break;
        case 'drop':
            while( valid(0, 1) ) {
                ++currentY;
            }
            clearInterval( interval );
            interval = setInterval( tick, 200 );
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

    for ( let y = 0; y < 4; ++y ) {
        for ( let x = 0; x < 4; ++x ) {
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

function playButtonClicked() {
    newGame();
    document.getElementById("playbutton").disabled = true;
}

function newGame() {
    clearAllIntervals();
    intervalRender = setInterval( render, 30 );
    init();
    newShape();
    lose = false;
    interval = setInterval( tick, 200 );
}

function clearAllIntervals(){
    clearInterval( interval );
    clearInterval( intervalRender );
}