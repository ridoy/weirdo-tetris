let canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
let ctx = canvas.getContext( '2d' );
let W = 300, H = 600;
let VH = 120;
let BLOCK_W = W / COLS, BLOCK_H = H / ROWS;
let VIRTUAL_ROWS = 4;

// draw a single square at (x, y)
function drawBlock( x, y ) {
    ctx.fillRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
    ctx.strokeRect( BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1 , BLOCK_H - 1 );
}

function render() {
    ctx.clearRect( 0, 0, W, H + VH);

    // Draw landed pieces
    ctx.strokeStyle = 'black';
    for ( let x = 0; x < COLS; ++x ) {
        for ( let y = 0; y < ROWS + VIRTUAL_ROWS; ++y ) {
            if ( board[ y ][ x ] ) {
                ctx.fillStyle = colors[ board[ y ][ x ] - 1 ];
                drawBlock( x, y );
            }
        }
    }

    // Draw grid
    ctx.strokeStyle = 'lightgrey';
    for ( let x = 0; x < COLS; ++x ) {
        for ( let y = 0; y < ROWS + VIRTUAL_ROWS; ++y ) {
            ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);
        }
    }

    // Draw current shape
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'black';
    for ( let y = 0; y < 4; ++y ) {
        for ( let x = 0; x < 4; ++x ) {
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