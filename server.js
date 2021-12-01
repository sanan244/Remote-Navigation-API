//Web server
const { exec } = require('child_process');
var http = require('http');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const qs = require('querystring');


//mysql
var mysql = require('mysql');
var lat = 0;
var lon = 1;

//app.use(bodyParser.json());
//app.use(express.static("./"));
var con = mysql.createConnection({  
    host: "10.111.1.48",   
    user: "remote_user",  
    password: "student",  
    database: "root"  
    });  

    // Create mysql connection
    con.connect(function(err) {  
        if (err) throw err;  

    console.log("   ...Mysql Connected!");  
    });  

//create a server object:
http.createServer(function (req, res) {
    //console.log(req.url, req.method, req. headers);
    // set response header
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.writeHead(200, { 'Content-Type': 'text/html' }); 
    if(req.method == "GET"){

    var sql = "SELECT * FROM coordinates WHERE `id` =(SELECT MAX(id) FROM coordinates)";   
    con.query(sql, function (err, result) {  
    if (err) throw err;  

    result = JSON.stringify(result);
    //console.log("Number of records inserted: " + result.affectedRows);
        console.log("   ...Get Request:", result)
        res.write(result)
        res.end(); //end the response
    
    });
    }//End of Request Call
    else if(req.method == "POST"){ 
        // Process data stream
        let data = '';
        req.on('data', chunk => {
            //console.log(`Data chunk available: ${chunk}`)
            data += chunk;
        });
        req.on('end', () => {
            console.log("   ...Post Request:", data)
            var location = qs.parse(data)
            //console.log(location.latitude_, location.longitude_);
            
        // Execute Query with processed data
        var sql = "INSERT INTO coordinates (latitude, longitude) VALUES (" + location.latitude_ + "," + location.longitude_ + ")";   
        con.query(sql, function (err, result) {  
        if (err) throw err;  
        //console.log(result)
        result = JSON.stringify(result);
        //console.log("Number of records inserted: " + result.affectedRows);
            res.write(result)
            res.end(); //end the response
        });
    });
    }// End of Post Call
        
}).listen(8080); //the server object listens on port 8080
console.log('Node.js web server at port 8080 is running..')
