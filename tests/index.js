const test = require('tape'),
    fs = require('fs'),
    http = require('http'),
    jsdom = require("jsdom"),
    PORT = 1234,
    TEST_SERVER = 'http://localhost:' + PORT + '/';

function router(req, res) {
    if (req.url.indexOf('refresh.svg') > -1) {
        res.writeHead(200, {'Content-Type': 'image/svg+xml'});
        res.write(fs.readFileSync(__dirname + '/../refresh.svg'));
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(fs.readFileSync(__dirname + '/../index.html'));
    }
    res.end();
}

var testServer = http.createServer(router),
    localStorage = {
        __store: {},
        setItem: function (name, obj) {
            localStorage.__store[name] = obj;
        },
        getItem: function (name) {
            return localStorage.__store[name];
        }
    };

function getDom(cb) {
    jsdom.env({
        url: TEST_SERVER,
        features: {
            FetchExternalResources: ['script'],
            ProcessExternalResources: ['script'],
            QuerySelector: true
        },
        done: function (err, window) {
            if (cb) cb(err, window);
        }
    });
}

testServer.listen(PORT, function () {
    test('site displays', function (t) {
        getDom(function (err, window) {
            t.plan(1);
            if (err) t.fail('Error parsing website');

            t.ok(window.document.getElementById('score-board'), 'Score board is visible');
        })
    });

    test('can click on cell', function (t) {
        t.plan(1);
        t.fail('TODO')
    });

/*    test('can get cell by coord', function (t) {
        t.plan(1);
        getDom(function (err, window) {
            t.equals(window.getCellByCoord({
                x: 2,
                y: 3
            }).dataset.x, 2, 'getCellByCoord should return correct coord cell');
        })
    });
    */

    test('load previous game with diagonal combo', function (t) {
        t.plan(3);

        getDom(function (err, window) {
            if (!window.localStorage) window.localStorage = localStorage;

            if (err) t.fail('Error parsing website');

            t.equals(typeof window.loadPreviousGame, 'function', 'loadPreviousGame() should be a function');

            window.localStorage.setItem('endlessGomoku', JSON.stringify([
                {player: 'x', coord: {x: 10, y: 25}},
                {player: 'x', coord: {x: 11, y: 24}},
                {player: 'x', coord: {x: 12, y: 23}},
                {player: 'x', coord: {x: 13, y: 22}},
                {player: 'x', coord: {x: 14, y: 21}}
            ]));
            
            window.loadPreviousGame();

            var oneOfComboCells = window.getCellByCoord({x: 12, y: 23});
            t.ok(oneOfComboCells, 'Combo cell should exist at those coordinates');

            t.equals(oneOfComboCells.dataset.combotype, 'northwest', 'Combo type should be northwest');
        });


    });

    test.onFinish(function () {
        testServer.close();
        process.exit();
    });
});