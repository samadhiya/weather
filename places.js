var Promise = require("bluebird");
var fs = require("fs");
var moment = require('moment-timezone');

var places = {};
//Read cities from the json file
places.getPlaces = function (params) {
    return new Promise(function (resolve, reject) {
        var places = [];
        var contents = fs.readFileSync("places.json");
        var jsonContent = JSON.parse(contents);
        for (var i = 0; i < jsonContent.features.length; i++) {
            var place = jsonContent.features[i];
            places.push({
                name: place.properties.NAME,
                latitude: place.properties.LATITUDE.toFixed(2),
                longitude: place.properties.LONGITUDE.toFixed(2),
                altitude: place.properties.ELEVATION.toFixed(0),
                time: moment().tz(place.properties.TIMEZONE)
            });
        }
        resolve(places);
    });
};

module.exports = places;