
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
*/