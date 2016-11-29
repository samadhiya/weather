var should = require('should');
var io = require('socket.io-client'),
    server = require('../server');

var socketURL = 'http://localhost:8080';

var options = {
    transports: ['websocket'],
    'force new connection': true
};

describe("Weather generator", function () {

    /* Test 1 - checking weather data type (=Array) & not empty  */
    it('Checking weather data type (=Array) & not empty ', function (done) {
        this.timeout(60000);
        var checkMessage = function (client) {
            client.on('weather', function (data) {
                data.should.be.an.Array();
                data.length.should.be.above(0);
                client.disconnect();
                done();
            });
        };
        var testClient = io.connect(socketURL, options);
        checkMessage(testClient);
    });

    /* Test 2 - Validating all the required values are present(place, position, time etc) */
    it('Validating all the required values are present(place, position, time', function (done) {
        this.timeout(60000);
        var checkMessage = function (client) {
            client.on('weather', function (data) {
                for (var i = 0; i < data.length; i++) {
                    var info = data[i].split('|');
                    info.should.be.an.Array();
                    info.length.should.be.equal(7);
                }
                client.disconnect();
                done();
            });
        };
        var testClient = io.connect(socketURL, options);
        checkMessage(testClient);
    });

    /* Test 3 - data emitting every 10 seconds   */
    it('Data emitting every 10 seconds ', function (done) {
        this.timeout(60000);
        var time1, time2;
        var checkMessage = function (client) {
            client.on('weather', function (data) {
                if (!time1) {
                    time1 = new Date();
                } else {
                    time2 = new Date();
                    var diff = Math.round((time2.getTime() - time1.getTime()) / 1000);
                    diff.should.be.aboveOrEqual(10);
                    client.disconnect();
                    done();
                }
            });
        };
        var testClient = io.connect(socketURL, options);
        checkMessage(testClient);
    });

    /* Test 4 - Checking the format of weather data  */
    it('Checking the format of weather data', function (done) {
        this.timeout(60000);
        var checkMessage = function (client) {
            client.on('weather', function (data) {
                for (var i = 0; i < data.length; i++) {
                    var info = data[i].split('|');
                    info[0].should.be.a.String();
                    var loc = info[1].split(',');
                    loc.should.be.an.Array();
                    loc.length.should.be.equal(3);
                    parseFloat(loc[0]).should.not.be.NaN();
                    parseFloat(loc[1]).should.not.be.NaN();
                    parseFloat(loc[2]).should.not.be.NaN();
                    var date = new Date(info[2]);
                    date.should.not.be.NaN();
                    info[3].should.be.a.String();
                    parseInt(info[4]).should.not.be.NaN();
                    parseFloat(info[5]).should.not.be.NaN();
                    parseInt(info[6]).should.not.be.NaN();
                }
                client.disconnect();
                done();
            });
        };
        var testClient = io.connect(socketURL, options);
        checkMessage(testClient);
    });

});