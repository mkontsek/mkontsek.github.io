var SQUARE_PX = 40,
    APP = document.getElementById('grid'),
    COMBO_COUNT = 5,
    currentPlayer,
    SCORE_X = document.getElementById('score-player-x'),
    SCORE_O = document.getElementById('score-player-o'),
    SCOREBOARD = document.getElementById('score-board'),
    GAME_PLAY = [];

// Grid bounds (inclusive) — starts 101x101, expands up to 1000x1000
var gridMinX = -50, gridMaxX = 50,
    gridMinY = -50, gridMaxY = 50;

var EXPAND_THRESHOLD = 3;
var EXPAND_BY = 20;
var GRID_LIMIT = 500; // abs max in each direction from 0

function Coord(x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
}

if (navigator.userAgent.toLowerCase().indexOf('android') > -1 ||
    navigator.userAgent.toLowerCase().indexOf('iphone') > -1) {
    window.onscroll = function () {
        SCOREBOARD.style.top = document.body.scrollTop;
        SCOREBOARD.style.left = document.body.scrollLeft;
    }
}

function setRandomCurrentPlayer() {
    currentPlayer = ['x', 'o'][Math.round(Math.random())];
    SCORE_X.className = '';
    SCORE_O.className = '';
    if (currentPlayer === 'x') SCORE_X.className = 'current-player';
    else SCORE_O.className = 'current-player';
}

setRandomCurrentPlayer();

document.getElementById('refresh').addEventListener('click', function () {
    GAME_PLAY.forEach(function (step) {
        var el = getCellByCoord(step.coord);
        if (!el) return;
        el.innerHTML = '';
        el.removeAttribute('data-player');
        el.dataset.combotype = '';
        el.style.color = '';
        el.querySelectorAll('.line-lr, .line-tb, .line-tlbr, .line-trbl').forEach(function (line) {
            line.remove();
        });
    });
    window.localStorage.removeItem('endlessGomoku');
    document.getElementById('points-for-x').innerHTML = 0;
    document.getElementById('points-for-o').innerHTML = 0;
    setRandomCurrentPlayer();
});

function updateCurrentPlayer() {
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    if (currentPlayer === 'o') {
        SCORE_X.classList.remove('current-player');
        SCORE_O.classList.add('current-player');
    } else {
        SCORE_X.classList.add('current-player');
        SCORE_O.classList.remove('current-player');
    }
}

function createCell(x, y) {
    var cell = document.createElement('td');
    cell.innerHTML = '';
    cell.style.width = SQUARE_PX + 'px';
    cell.style.height = SQUARE_PX + 'px';
    cell.className = 'cell';
    cell.dataset.x = x;
    cell.dataset.y = y;
    cell.dataset.combotype = '';

    cell.addEventListener('click', function () {
        if (!this.dataset.player) {
            this.innerHTML = currentPlayer.toUpperCase() + this.innerHTML;
            this.dataset.player = currentPlayer;
            this.style.color = 'black';

            this.classList.remove('placed-piece');
            void this.offsetWidth;
            this.classList.add('placed-piece');

            GAME_PLAY.push({player: currentPlayer, coord: new Coord(this.dataset.x, this.dataset.y)});
            window.localStorage.setItem('endlessGomoku', JSON.stringify(GAME_PLAY));

            checkLogic(this);
            updateCurrentPlayer();

            expandIfNeeded(parseInt(this.dataset.x), parseInt(this.dataset.y));
        }
    });

    return cell;
}

function createGrid() {
    APP.innerHTML = '';
    document.body.style.minWidth = SQUARE_PX * (gridMaxX - gridMinX + 1 + 8) + 'px';

    for (var i = gridMinY; i <= gridMaxY; i++) {
        var row = document.createElement('tr');
        row.dataset.y = i;
        for (var j = gridMinX; j <= gridMaxX; j++) {
            row.appendChild(createCell(j, i));
        }
        APP.appendChild(row);
    }
}


function expandIfNeeded(x, y) {
    var expanded = false;

    // Expand right
    if (x >= gridMaxX - EXPAND_THRESHOLD && gridMaxX < GRID_LIMIT) {
        var newMaxX = Math.min(gridMaxX + EXPAND_BY, GRID_LIMIT);
        APP.querySelectorAll('tr').forEach(function (row) {
            var ry = parseInt(row.dataset.y);
            for (var nx = gridMaxX + 1; nx <= newMaxX; nx++) {
                row.appendChild(createCell(nx, ry));
            }
        });
        gridMaxX = newMaxX;
        expanded = true;
    }

    // Expand left
    if (x <= gridMinX + EXPAND_THRESHOLD && gridMinX > -GRID_LIMIT) {
        var newMinX = Math.max(gridMinX - EXPAND_BY, -GRID_LIMIT);
        APP.querySelectorAll('tr').forEach(function (row) {
            var ry = parseInt(row.dataset.y);
            var firstCell = row.firstChild;
            for (var nx = gridMinX - 1; nx >= newMinX; nx--) {
                row.insertBefore(createCell(nx, ry), firstCell);
                firstCell = row.firstChild;
            }
        });
        gridMinX = newMinX;
        expanded = true;
    }

    // Expand down
    if (y >= gridMaxY - EXPAND_THRESHOLD && gridMaxY < GRID_LIMIT) {
        var newMaxY = Math.min(gridMaxY + EXPAND_BY, GRID_LIMIT);
        for (var ny = gridMaxY + 1; ny <= newMaxY; ny++) {
            var row = document.createElement('tr');
            row.dataset.y = ny;
            for (var nx = gridMinX; nx <= gridMaxX; nx++) {
                row.appendChild(createCell(nx, ny));
            }
            APP.appendChild(row);
        }
        gridMaxY = newMaxY;
        expanded = true;
    }

    // Expand up
    if (y <= gridMinY + EXPAND_THRESHOLD && gridMinY > -GRID_LIMIT) {
        var newMinY = Math.max(gridMinY - EXPAND_BY, -GRID_LIMIT);
        var firstRow = APP.firstChild;
        for (var ny = gridMinY - 1; ny >= newMinY; ny--) {
            var row = document.createElement('tr');
            row.dataset.y = ny;
            for (var nx = gridMinX; nx <= gridMaxX; nx++) {
                row.appendChild(createCell(nx, ny));
            }
            APP.insertBefore(row, firstRow);
            firstRow = APP.firstChild;
        }
        gridMinY = newMinY;
        expanded = true;
    }

    if (expanded) {
        document.body.style.minWidth = SQUARE_PX * (gridMaxX - gridMinX + 1 + 8) + 'px';
    }
}

function getCellByCoord(coord) {
    return APP.querySelector('.cell[data-x="' + coord.x + '"][data-y="' + coord.y + '"]');
}

var hasComboFn = {
    checkCombo: function (cell, coord) {
        var nextCell = getCellByCoord(coord);
        if (!nextCell) return false;
        return nextCell.dataset.player === cell.dataset.player;
    },

    north: function (cell, coord) {
        coord.y--;
        return hasComboFn.checkCombo(cell, coord);
    },

    northeast: function (cell, coord) {
        coord.y--;
        coord.x++;
        return hasComboFn.checkCombo(cell, coord);
    },

    east: function (cell, coord) {
        coord.x++;
        return hasComboFn.checkCombo(cell, coord);
    },

    southeast: function (cell, coord) {
        coord.y++;
        coord.x++;
        return hasComboFn.checkCombo(cell, coord);
    },

    south: function (cell, coord) {
        coord.y++;
        return hasComboFn.checkCombo(cell, coord);
    },

    southwest: function (cell, coord) {
        coord.y++;
        coord.x--;
        return hasComboFn.checkCombo(cell, coord);
    },

    west: function (cell, coord) {
        coord.x--;
        return hasComboFn.checkCombo(cell, coord);
    },

    northwest: function (cell, coord) {
        coord.y--;
        coord.x--;
        return hasComboFn.checkCombo(cell, coord);
    }
};

function hasCellCombo(cell) {
    var hasCombo = false;

    [
        ['north', 'south', 'line-tb'],
        ['northeast', 'southwest', 'line-trbl'],
        ['east', 'west', 'line-lr'],
        ['northwest', 'southeast', 'line-tlbr']
    ].forEach(function (moves) {
        if (hasCombo === true) return;

        var comboCells = [],
            coord = new Coord(cell.dataset.x, cell.dataset.y),
            firstDirection = moves[0],
            secondDirection = moves[1],
            lineClass = moves[2];

        while (comboCells.length < COMBO_COUNT && hasComboFn[firstDirection](cell, coord))
            comboCells.push(getCellByCoord(coord));

        comboCells.push(cell);

        coord = new Coord(cell.dataset.x, cell.dataset.y);
        while (comboCells.length < COMBO_COUNT && hasComboFn[secondDirection](cell, coord))
            comboCells.push(getCellByCoord(coord));

        if (comboCells.length >= COMBO_COUNT) {
            comboCells.forEach(function (comboCell) {
                var line = document.createElement('div');
                line.className = lineClass;
                comboCell.style.color = 'red';
                comboCell.appendChild(line);
            });

            hasCombo = true;
        }
    });

    return hasCombo;
}

function checkLogic(cell, player) {
    var _player = player ? player : currentPlayer;
    if (hasCellCombo(cell)) {
        var pointsEl = document.getElementById('points-for-' + _player);
        pointsEl.innerHTML = parseInt(pointsEl.innerHTML) + 1;
        pointsEl.classList.remove('score-updated');
        void pointsEl.offsetWidth;
        pointsEl.classList.add('score-updated');
    }
}

function loadPreviousGame() {
    var previousGameTxt = window.localStorage.getItem('endlessGomoku'),
        previousGame = JSON.parse(previousGameTxt);

    if (!previousGame || previousGame.length === 0) return;

    currentPlayer = previousGame[0].player;

    previousGame.forEach(function (gameStep) {
        var cell = getCellByCoord(gameStep.coord);
        if (cell) cell.click();
    });
}

//**** BEGIN - MAIN APP FLOW
createGrid();
loadPreviousGame();

// go to middle of grid — scroll to coord (0,0)
var midX = (-gridMinX) * SQUARE_PX;
var midY = (-gridMinY) * SQUARE_PX;
window.scroll(midX - window.innerWidth / 2, midY - window.innerHeight / 2);
//**** END   - MAIN APP FLOW
