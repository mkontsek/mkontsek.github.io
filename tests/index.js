const test = require('tape'),
    fs = require('fs'),
    http = require('http'),
    jsdom = require("jsdom"),
    PORT = 1234,
    TEST_SERVER = 'http://localhost:' + PORT + '/';

function router(req, res) {
    if(req.url.indexOf('refresh.svg') > -1) {
        res.writeHead(200, {'Content-Type': 'image/svg+xml'});
        res.write(fs.readFileSync(__dirname + '/../refresh.svg'));
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(fs.readFileSync(__dirname + '/../index.html'));
    }
    res.end();
}

http.createServer(router).listen(PORT, function () {
    test('site displays', function (t) {
        jsdom.env(TEST_SERVER, function (err, window) {
            if (err) t.fail('Error parsing website');

            t.ok(window.document.getElementById('score-board'), 'Score board not visible');
        })
    });

    test('diagonal combo', function (t) {
        t.fail('TODO');
    });

    test.onFinish(function () {
       http.close();
    });
});