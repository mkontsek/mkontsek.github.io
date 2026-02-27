var COLS = 100,
    SQUARE_PX = 40,
    APP = document.getElementById('grid'),
    COMBO_COUNT = 5,
    currentPlayer,
    SCORE_X = document.getElementById('score-player-x'),
    SCORE_O = document.getElementById('score-player-o'),
    SCOREBOARD = document.getElementById('score-board'),
    GAME_PLAY = [];

function Coord(x, y) {
    this.x = x;
    this.y = y;
}

if (navigator.userAgent.toLowerCase().indexOf('android') > -1 ||
    navigator.userAgent.toLowerCase().indexOf('iphone') > -1) {
    // position fixed not working for Android or iPhone, have to emulate
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
        el.innerHTML = '';
        el.removeAttribute('data-player');
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

function createGrid() {
    var i, j;

    document.body.style.width = SQUARE_PX * (COLS + 8);

    for (i = 0; i < COLS; i++) {
        var row = document.createElement('tr');

        for (j = 0; j < COLS; j++) {
            var cell = document.createElement('td');
            cell.innerHTML = '';
            cell.style.width = SQUARE_PX;
            cell.style.height = SQUARE_PX;
            cell.className = 'cell';
            cell.dataset.x = j;
            cell.dataset.y = i;
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
                }
            });

            row.appendChild(cell);
        }
        APP.appendChild(row);
    }
}

function getCellByCoord(coord) {
    return document.querySelector('.cell[data-x="' + coord.x + '"][data-y="' + coord.y + '"]');
}

function hasComboType(cell, combotype) {
    if (!cell.dataset.combotype) return false;

    var hasCombo = false;
    cell.dataset.combotype.split(',').forEach(function (cellCombo) {
        if (cellCombo === combotype) hasCombo = true;
    });

    return hasCombo;
}

var hasComboFn = {
    checkCombo: function (cell, coord, combotype) {
        var nextCell = getCellByCoord(coord) || {dataset: {}};
        return nextCell.dataset.player === cell.dataset.player && !hasComboType(nextCell, combotype);
    },

    north: function (cell, coord, combotype) {
        coord.y--;
        return hasComboFn.checkCombo(cell, coord, combotype);
    },

    northeast: function (cell, coord, combotype) {
        coord.y--;
        coord.x++;
        return hasComboFn.checkCombo(cell, coord, combotype);
    },

    east: function (cell, coord, combotype) {
        coord.x++;
        return hasComboFn.checkCombo(cell, coord, combotype);
    },

    southeast: function (cell, coord, combotype) {
        coord.y++;
        coord.x++;
        return hasComboFn.checkCombo(cell, coord, combotype);
    },

    south: function (cell, coord, combotype) {
        coord.y++;
        return hasComboFn.checkCombo(cell, coord, combotype);
    },

    southwest: function (cell, coord, combotype) {
        coord.y++;
        coord.x--;
        return hasComboFn.checkCombo(cell, coord, combotype);
    },

    west: function (cell, coord, combotype) {
        coord.x--;
        return hasComboFn.checkCombo(cell, coord, combotype);
    },

    northwest: function (cell, coord, combotype) {
        coord.y--;
        coord.x--;
        return hasComboFn.checkCombo(cell, coord, combotype);
    }
};

function hasCellCombo(cell) {
    var hasCombo = false;

    // check all functions
    [
        ['north', 'south'],
        ['northeast', 'southwest'],
        ['east', 'west'],
        ['northwest', 'southeast']
    ].forEach(function (moves) {
        if (hasCombo === true) return;

        var comboCells = [],
            coord = new Coord(cell.dataset.x, cell.dataset.y),
            firstDirection = moves[0],
            secondDirection = moves[1],
            combotype = moves[0] + moves[1]; // nice candidates for variable destructuring... but no IE support :-(

        // try one direction .... lalala
        while (comboCells.length < COMBO_COUNT && hasComboFn[firstDirection](cell, coord, combotype))
            comboCells.push(getCellByCoord(coord));

        comboCells.push(cell);

        // try the other direction
        coord = new Coord(cell.dataset.x, cell.dataset.y);
        while (comboCells.length < COMBO_COUNT && hasComboFn[secondDirection](cell, coord, combotype))
            comboCells.push(getCellByCoord(coord));

        if (comboCells.length >= COMBO_COUNT) {
            comboCells.forEach(function (comboCell) {
                var line = document.createElement('div');

                if (firstDirection === 'east') line.className = 'line-lr';
                if (firstDirection === 'north') line.className = 'line-tb';
                if (firstDirection === 'northeast') line.className = 'line-trbl';
                if (firstDirection === 'northwest') line.className = 'line-tlbr';

                comboCell.dataset.combotype += combotype + ',';
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
        getCellByCoord(gameStep.coord).click();
    });
}

//**** BEGIN - MAIN APP FLOW
createGrid();
loadPreviousGame();

// go to middle of grid
window.scroll(1500, 1500);
//**** END   - MAIN APP FLOW
