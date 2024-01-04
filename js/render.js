var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
var scoreDisplay = document.getElementById('score');
var ctx = canvas.getContext( '2d' );

var hasTouchScreen = false;

if ("maxTouchPoints" in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
} 
if (hasTouchScreen) {
    canvas.width = "225px";
    canvas.width = "540px";
}
var W = canvas.width
var totalHeight = canvas.height;
var H = (totalHeight / TOTAL_ROWS) * ROWS;
var VH = (totalHeight / TOTAL_ROWS) * VIRTUAL_ROWS;
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;
var VH = BLOCK_W * VIRTUAL_ROWS;



// draw a single square at (x, y)
function drawBlock( x, y, isGhost ) {
    if (!isGhost) {
        ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
    }
    ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}

function render() {
    ctx.fillStyle = 'white';
    ctx.clearRect( 0, 0, W, H + VH);
    ctx.fillRect(0, 0, W, H + VH);

    // Draw grid
    ctx.strokeStyle = 'lightgrey';
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS + VIRTUAL_ROWS; ++y ) {
            ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);
        }
    }

    // Draw true losing boundary
    ctx.strokeStyle = 'grey';
    ctx.strokeRect(0, VH, W, 1);

    // Draw landed pieces
    ctx.strokeStyle = 'black';
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS + VIRTUAL_ROWS; ++y ) {
            if ( board[ y ][ x ] ) {
                ctx.fillStyle = colors[ board[ y ][ x ] - 1 ];
                drawBlock( x, y );
            }
        }
    }

    // Draw current shape
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                ctx.fillStyle = colors[ current[ y ][ x ] - 1 ];
                drawBlock( currentX + x, currentY + y,);
            }
        }
    }

    // Draw ghost block
    ctx.strokeStyle = 'gold';
    ctx.shadowBlur = '10';
    ctx.shadowColor = 'gold';
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( ghostBlock[ y ][ x ] ) {
                drawBlock( ghostBlockX + x, ghostBlockY + y, true);
            }
        }
    }
    ctx.shadowBlur = '0';
    ctx.shadowColor = 'none';

    scoreDisplay.innerText = score;
}