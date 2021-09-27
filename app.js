
var mysql = require('mysql');
var lat = 0;
var lon = 1;
var con = mysql.createConnection({  
    host: "localhost",   
    user: "root",  
    password: "",  
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
