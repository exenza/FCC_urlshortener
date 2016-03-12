// Retrieve
var express = require("express")
var app = express()
var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://max:exenza@ds013599.mlab.com:13599/heroku_7807p3s1"

// Connect to the db
MongoClient.connect(mongoURL, function(err, db) {
  if(!err) {
    console.log("We are connected");
    app.get("/", function(req, res){
      res("All good");
    })
    
    app.listen(process.env.PORT || 5000)
  }
});