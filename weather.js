var w = {};

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function rand(d) {
    return Math.floor(Math.random() * 0.9999 * d);
}

//Method to get hemisphere based on latitude
function getHemisphere(place) {
    if (place.lat > 0)
        return 'north';
    else
        return 'south';
}
//Method to get zone based on latitude
function getZone(place) {
    if (place.lat <= 23.5 && place.lat >= -23.5)
        return 'warm';
    else if (place.lat <= 66.5 && place.lat >= -66.5)
        return 'temperate';
    else
        return 'cold';
}
//Method to get season based on latitude & time
function getSeason(place) {
    var hemisphere = getHemisphere(place);
    var month = place.time.month();
    if (month >= 5 && month <= 7) {
        return hemisphere == 'north' ? 'summer' : 'winter';
    }
    else if (month >= 8 && month <= 10) {
        return hemisphere == 'north' ? 'autumn' : 'spring';
    }
    else if (month >= 2 && month <= 4) {
        return hemisphere == 'north' ? 'spring' : 'autumn';
    }
    else
        return hemisphere == 'north' ? 'winter' : 'summer';
}

//base temperature values
var weather = {

    warm: {
        mod: {
            t_base: 30,
            t_change: 10
        }
    },
    temperate: {
        mod: {
            t_base: 20,
            t_change: 10
        }
    },
    cold: {
        mod: {
            t_base: 10,
            t_change: 10
        }
    }
};

//generate random weather based on city & time
w.getWeather=function (place) {
    //var hemisphere = getHemisphere(place);
    var zone = getZone(place);
    var season = getSeason(place);
    var mod = rand(weather[zone].mod.t_change) * (season == 'summer' || season == 'spring' ? 1 : -1);
    place.temperature = weather[zone].mod.t_base + mod;
    if (season == 'winter') {
        place.condition = 'Snow';
    }
    else if (season == 'autumn') {
        place.condition = 'Rain';
    }
    else {
        place.condition = 'Sunny';
    }
    place.pressure = getRandomNumber(850,1100);
    place.humidity = getRandomNumber(25,95);
    return place;
}
module.exports = w;
