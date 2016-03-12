// Retrieve
var express = require("express")
var app = express()
var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://max:exenza@ds013599.mlab.com:13599/heroku_7807p3s1"

// Connect to the db
MongoClient.connect(mongoURL, function(err, db) {
  if (err) throw err
    console.log("We are connected");
});

//Serve a static file with instructions
app.get("/", function(req, res){
      res.send("Will serve a static file in HTML");
    })

//Evaluate domain
app.get("/new/*", function(req, res){
  //validate url
  
  //search url in DB
  
  res.send("Evaluate domain")
})
    
//Redirect
app.get("/*", function(req, res){
  res.send("Redirect")
})


app.listen(process.env.PORT || 8080)