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

    test.onFinish(function () {
        testServer.close();
        process.exit();
    });
});