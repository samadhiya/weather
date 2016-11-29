var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    places = require('./places'),
    weather = require('./weather');

// Send weather to all connected clients
function sendWeather() {
    var res = [];
    for (var i = 0; i < cities.length; i++) {
        //Get weather info for each city
        var wInfo = weather.getWeather(cities[i]);
        var data = [];
        data.push(wInfo.name);
        data.push(wInfo.latitude + ','+ wInfo.longitude + ',' + wInfo.altitude);
        data.push(wInfo.time.format());
        data.push(wInfo.condition);
        data.push(wInfo.temperature);
        data.push(wInfo.pressure);
        data.push(wInfo.humidity);
        //Push it to response array
        res.push(data.join('|'));
    }
    io.emit('weather', res);
}

//Get list of places from places module
var cities = [];
places.getPlaces().then(function (data) {
    console.log(data.length + ' cities fetched');
    cities = data;
    // Send current time every 10 secs
    setInterval(sendWeather, 10000);

});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('./public/index.html');
});

// listen (start app with node server.js) ======================================
server.listen(8080);
console.log("App listening on port 8080");