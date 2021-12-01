
var lat = 33.8830;
var lng = -117.8851;
var lngLat = {
    lng: lng,
    lat: lat
};
//var rawCoordinates = []
var stringCoordinates = ''
mapboxgl.accessToken = 'pk.eyJ1IjoiaHZlbnRheWVuIiwiYSI6ImNrbzE1MTBuZzA2Y3MydXFoc3RrdWtmNDYifQ.x6rbgWC9a0lnI0WxkOVdow';
var map = new mapboxgl.Map({
    container: 'map', // Specify the container ID
    style: 'mapbox://styles/mapbox/streets-v11', // Specify which map style to use
    center: [lng, lat], // Specify the starting position
    zoom: 15.7, // Specify the starting zoom
});

var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        //point: true
        line_string: true,
        //trash: true
    }
});
map.addControl(draw);
map.on('draw.create', updateLine);
map.on('draw.delete', updateLine);
map.on('draw.update', updateLine);
// function getCoordinates(e) {
//     var data = draw.getAll();
//     console.log(data)
// }
function removeData(e) {
    console.log("deleting")
}
/*
// basic geolocation, gives you a button to press
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    })
);
    */
// Initiates geolocation API
const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
})
map.addControl(geolocate);
map.on('load', function() {
// When the map loads, add the source and layer
map.addSource('directions-line', {
    type: 'geojson',
    lineMetrics: true,
    data: {
        "type": 'FeatureCollection',
        "features": []
    }
});
map.addSource('rawPoints', {
    type: 'geojson',
    data: {
        "type": 'FeatureCollection',
        "features": []
    }
});

map.addLayer({
    'id': 'raw-points',
    'type': 'circle',
    // Use "iso" as the data source for this layer
    'source': 'rawPoints',
    'layout': {},
    'paint': {
        // The fill color for the layer is set to a light purple
        'circle-color': '#F5F2FF',
        'circle-opacity': 0.8,
        'circle-stroke-color': '#6313E4',
        'circle-stroke-width': 2
    }
}, "road-label");
map.addLayer({
    'id': 'directions-line-core',
    'type': 'line',
    // Use "iso" as the data source for this layer
    'source': 'directions-line',
    'layout': {
        'line-cap': "round"
    },
    'paint': {
        // The fill color for the layer is set to a light purple
        'line-color': '#FED6F5',
        'line-width': [
            "interpolate",
            ["exponential", 1.5],
            ["zoom"],
            12,
            3,
            14,
            5,
            18,
            16
        ],
        'line-opacity': 1,
        'line-gradient': [
            'interpolate',
            ['linear'],
            ['line-progress'],
            0, "#FDBBEF",
            1, "#8C00D7"
        ]
    }
}, "raw-points");
map.addLayer({
    'id': 'directions-line-casing',
    'type': 'line',
    // Use "iso" as the data source for this layer
    'source': 'directions-line',
    'layout': {
        'line-cap': "round"
    },
    'paint': {
        // The fill color for the layer is set to a light purple
        'line-color': '#8C00D7',
        'line-width': [
            "interpolate",
            ["exponential", 1.5],
            ["zoom"],
            12,
            0.5,
            14,
            2,
            18,
            18
        ],
        'line-opacity': 1
    }
}, "directions-line-core");

//Geolocation triggers when map first loads
geolocate.trigger();



// Initialize the marker at the query coordinates
//marker.setLngLat(lngLat).addTo(map);
// Make the API call
});
function updateLine(e) {
    map.getSource('rawPoints').setData({});
    var rawCoordinates = draw.getAll();
    draw.deleteAll();
    stringCoordinates = ''
    stringRadiuses = ''
    console.log("rawCoordinates" + rawCoordinates.features[0].geometry)
    if (rawCoordinates.features.length > 0) {
        for (coordinatesIndex in rawCoordinates.features[0].geometry.coordinates) {
            var pointCoordinates = rawCoordinates.features[0].geometry.coordinates[coordinatesIndex]
            //console.log(data.features[0].geometry.coordinates[coordinatesIndex])
            stringCoordinates += pointCoordinates + ';'
            //console.log(stringCoordinates)
            //stringRadiuses += radiuses
        }
        //tringCoordinates += 'radiuses=' + stringRadiuses
        // Removing the last semicolon which is not needed to construct the API request
        stringCoordinates = stringCoordinates.substring(0, stringCoordinates.length - 1);
        map.getSource('rawPoints').setData(rawCoordinates.features[0].geometry);
        getDirections(stringCoordinates)
    } else {
        if (e.type !== 'draw.delete') alert("Use the draw tools to draw a polygon!");
    }
}
// Create variables to use in getIso()
var urlBase = 'https://api.mapbox.com/directions/v5/mapbox';
https://api.mapbox.com/directions/v5/mapbox/cycling/-122.42,37.78;-77.03,38.91?access_token=pk.eyJ1IjoiZWFsZXNzYW5kcmluaSIsImEiOiJjajNjMWg1ankwMDBpMzJta2p2aGd5YWNtIn0.KVzrBvg0edGdM3v3hA_DtQ
var profile = 'driving';
var overview = 'simplified'
var annotations = 'none'
var geometries = 'geojson'
var radiuses = '10'
var token = 'pk.eyJ1IjoiaHZlbnRheWVuIiwiYSI6ImNrbzE1MTBuZzA2Y3MydXFoc3RrdWtmNDYifQ.x6rbgWC9a0lnI0WxkOVdow'
// Create a function that sets up the directions API query then makes an Ajax call
function getDirections(rawCoordinates) {
    var publicQuery = urlBase + '/' + profile + '/' + rawCoordinates + '?geometries=geojson&overview=' + overview + '&annotations=' + annotations + '&access_token=INSERT_YOUR_MAPBOX_TOKEN_HERE'
    var query = urlBase + '/' + profile + '/' + rawCoordinates + '?geometries=' + geometries + '&overview=' + overview + '&access_token=' + token
    if (overview == 'full' && annotations != 'none') {
        query += '&annotations=' + annotations
    }
    var directionsApiCallView = document.getElementById("directions-api-call")
    directionsApiCallView.innerHTML = "<pre><code>" + publicQuery + "</code></pre>"
    console.log("query", query)
    $.ajax({
        method: 'GET',
        url: query
    }).done(function (responseData) {
        // Set the 'directions-line' source's data to what's returned by the API query
        console.log("response" + responseData.routes[0].geometry)
        console.log(JSON.stringify(responseData.routes[0].geometry))
        // map.getSource('directions-line').setData('')
        map.getSource('directions-line').setData(responseData.routes[0].geometry);
        // console.log(JSON.stringify(data, undefined, 2))
        var directionsJsonView = document.getElementById("directions-json-response")
        directionsJsonView.innerHTML = "<pre><code>" + JSON.stringify(responseData, null, 6) +
            "</code></pre>"
        //rdirectionsJsonView.scrollIntoView();
    })
};

var params = document.getElementById('params');
// When a user changes the value of profile or duration by clicking a button, change the parameter's value and make the API query again
params.addEventListener('change', function(e) {
if (stringCoordinates.length == 0) {
    return
}
if (e.target.name === 'profile') {
    profile = e.target.value;
    getDirections(stringCoordinates)
} else if (e.target.name === 'duration') {
    minutes = e.target.value;
    getDirections(stringCoordinates)
} else if (e.target.name === 'directions-style') {
    polygonStyle = e.target.value;
    //console.log(polygonStyle)
    getDirections(stringCoordinates)
}  else if (e.target.name === 'overview') {
    //polygonStyle = e.target.value;
    overview = e.target.value;
    //console.log(e.target.value)
    getDirections(stringCoordinates)
} else if (e.target.name === 'annotations') {
    //polygonStyle = e.target.value;
    annotations = e.target.value;
    //console.log(e.target.value)
    getDirections(stringCoordinates)
} else if (e.target.name === 'geometries') {
    //polygonStyle = e.target.value;
    geometries = e.target.value;
    //console.log(e.target.value)
    getDirections(stringCoordinates)
}
});
geolocate.on('geolocate', function()
{

//Get the updated user location, this returns a javascript object.
var userlocation = geolocate._lastKnownPosition;

//Your work here - Get coordinates like so
var lat = userlocation.coords.latitude;
var lng = userlocation.coords.longitude;
//GEOLOCATION OUTPUT
console.log(JSON.stringify(userlocation.coords.latitude))
console.log(JSON.stringify(userlocation.coords.longitude))
});


/*
var exports = {};

// Create Database and insert userlocation into table
console.log("loading mysql module...");
require(['node_modules/mysql/index.js',],function(mysql){
console.log("Module loaded.")
console.log("Creating connection...");
var con = mysql.createConnection({  
host: "localhost",   
user: "root",  
password: "student",  
database: "Coordinates_table"  
});  
con.connect(function(err) {  
if (err) throw err;  
console.log("Connected!");  
var sql = "INSERT INTO coordinates (latitude, longitude) VALUES ?";  
var values = [  
[ JSON.stringify(userlocation.coords.latitude), JSON.stringify(userlocation.coords.longitude) ],  
];  
con.query(sql, [values], function (err, result) {  
if (err) throw err;  
console.log("Number of records inserted: " + result.affectedRows);  
});
});
});


setTimeout(function (){
/// your code
var mysql = require('mysql');
var lat = 0;
var lon = 1;
var con = mysql.createConnection({  
host: "localhost",   
user: "root",  
password: "Awesome224",  
database: "root"  
});  
con.connect(function(err) {  
if (err) throw err;  
console.log("Connected!");  
var sql = "SELECT * FROM coordinates WHERE `id` =(SELECT MAX(id) FROM coordinates)";  
var values = [  
[ JSON.stringify(lat),JSON.stringify(lon) ],  
];  
con.query(sql, function (err, result) {  
if (err) throw err;  
Object.keys(result).forEach(function(key) {
    var row = result[key];
    console.log(row)});
//console.log("Number of records inserted: " + result.affectedRows);

});  
});
},10000);
*/