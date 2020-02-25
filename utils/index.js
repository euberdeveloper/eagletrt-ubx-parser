function parseCoordinates (value) {
    const temp = value / 100;
    const left = Math.floor(temp);
    const right = (temp - left) * (5 / 3);
    return left + right;
}

module.exports = {
    getGGA: function (rows) {
        return rows
            .filter(row => row.indexOf('GGA') != -1)
            .map(row => row.split(','))
            .map(words => ({ utc_time: words[1], latitude: words[2], longitude: words[4] }));
    },
    getGLL: function (rows) {
        return rows
            .filter(row => row.indexOf('GLL') != -1)
            .map(row => row.split(','))
            .map(words => ({ utc_time: words[5], latitude: words[1], longitude: words[3] }));
    },
    getRMC: function (rows) {
        return rows
            .filter(row => row.indexOf('RMC') != -1)
            .map(row => row.split(','))
            .map(words => ({ utc_time: words[1], latitude: words[3], longitude: words[5] }));
    },
    getData: function (GGA, GLL, RMC) {
        return [...GGA, ...GLL, ...RMC]
            .sort((x, y) => x.utc_time - y.utc_time)
            .map(({ utc_time, latitude, longitude }) => ({ 
                utc_time, 
                latitude: parseCoordinates(latitude),
                longitude: parseCoordinates(longitude),
            }));
    },
    getJsonData: function (data) {
        return JSON.stringify(data, null, 2);
    },
    getCsvData: function (data) {
        return 'utc_time\tlatitude\tlongitude\n' + data
            .map(({ utc_time, latitude, longitude }) => `${utc_time}\t${latitude}\t${longitude}\n`)
            .join('');
    }
};