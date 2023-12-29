var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
var ctx = canvas.getContext( '2d' );
var W = 300, H = 600;
var VH = 120;
var BLOCK_W = W / COLS, BLOCK_H = H / ROWS;
var VIRTUAL_ROWS = 4;

// draw a single square at (x, y)
function drawBlock( x, y ) {
    ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
    ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}

function render() {
    ctx.clearRect( 0, 0, W, H + VH);

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

    // Draw grid
    ctx.strokeStyle = 'lightgrey';
    for ( var x = 0; x < COLS; ++x ) {
        for ( var y = 0; y < ROWS + VIRTUAL_ROWS; ++y ) {
            ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);
        }
    }

    // Draw current shape
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';
    for ( var y = 0; y < 4; ++y ) {
        for ( var x = 0; x < 4; ++x ) {
            if ( current[ y ][ x ] ) {
                ctx.fillStyle = colors[ current[ y ][ x ] - 1 ];
                drawBlock( currentX + x, currentY + y);
            }
        }
    }

    // Draw true losing boundary
    ctx.strokeStyle = 'grey';
    ctx.strokeRect(0, VH, W, 1);
}