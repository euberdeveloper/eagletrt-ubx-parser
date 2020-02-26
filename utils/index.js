function purgeNull (value) {
    return {
        utc_time: value.utc_time === null ? 'null' : value.utc_time,
        latitude: value.latitude === null ? 'null' : value.latitude,
        longitude: value.longitude === null ? 'null' : value.longitude,
        altitude: value.altitude === null ? 'null' : value.altitude,
        speed_human: value.utc_time === null ? 'null' : value.utc_time,
        speed_knots: value.speed_knots === null ? 'null' : value.speed_knots
    };
}

function parseCoordinates (value) {
    const temp = +value / 100;
    const left = Math.floor(temp);
    const right = (temp - left) * (5 / 3);
    return left + right;
}

module.exports = {
    getGGA: function (rows) {
        return rows
            .filter(row => row.indexOf('GGA') != -1)
            .map(row => row.split(','))
            .map(words => ({ 
                utc_time: words[1], 
                latitude: words[2], 
                longitude: words[4],
                altitude: words[9],
                speed_human: null,
                speed_knots: null
            }));
    },
    getGLL: function (rows) {
        return rows
            .filter(row => row.indexOf('GLL') != -1)
            .map(row => row.split(','))
            .map(words => ({ 
                utc_time: words[5], 
                latitude: words[1], 
                longitude: words[3],
                altitude: null,
                speed_human: null,
                speed_knots: null
            }));
    },
    getRMC: function (rows) {
        return rows
            .filter(row => row.indexOf('RMC') != -1)
            .map(row => row.split(','))
            .map(words => ({ 
                utc_time: words[1], 
                latitude: words[3], 
                longitude: words[5],
                altitude: null,
                speed_human: null,
                speed_knots: words[7]
            }));
    },
    getVTG: function (rows) {
        return rows
            .filter(row => row.indexOf('VTG') != -1)
            .map(row => row.split(','))
            .map(words => ({ 
                utc_time: null, 
                latitude: null, 
                longitude: null,
                altitude: null,
                speed_human: words[7],
                speed_knots: words[5]
            }));
    },
    getData: function (GGA, GLL, RMC, VTG) {
        return [...GGA, ...GLL, ...RMC, ...VTG]
            .sort((x, y) => x.utc_time - y.utc_time)
            .map(({ utc_time, latitude, longitude, altitude, speed_human, speed_knots }) => ({ 
                utc_time, 
                latitude: parseCoordinates(latitude),
                longitude: parseCoordinates(longitude),
                altitude,
                speed_human,
                speed_knots
            }))
            //.map(value => purgeNull(value));
    },
    getJsonData: function (data) {
        return JSON.stringify(data, null, 2);
    },
    getCsvData: function (data) {
        return 'utc_time\tlatitude\tlongitude\taltitude\tspeed_human\tspeed_knots\n' + data
            .map(({ utc_time, latitude, longitude, altitude, speed_human, speed_knots }) => `${utc_time}\t${latitude}\t${longitude}\t${altitude}\t${speed_human}\t${speed_knots}\n`)
            .join('');
    }
};