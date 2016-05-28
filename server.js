// Retrieve
var express = require("express")
var app = express()
var urlp = require("url")
var MongoClient = require('mongodb').MongoClient;
var assert = require("assert")
var ObjectId = require("mongodb").ObjectId
var mongoURL = "mongodb://max:exenza@ds013599.mlab.com:13599/heroku_7807p3s1"

//Connect to DB
function cDB(callback){
  MongoClient.connect(mongoURL, function(err, db ) {
    if (err) throw err
      //db.close
      //console.log("Connected to DB")
      callback(db)
    })
  };

//Serve a static file with instructions
app.get("/", function(req, res){
      app.use('/', express.static(__dirname + '/public'));
    })

//validate function
function validate(url) {
  url = url.split('/new/')[1]
  //Test for second level domain as url module is accepting topLevel domain i.e. "foo" as a valid URL
  if(!url.split('.')[1]) return false
  var testUrl=urlp.parse(url).protocol
  // if fails retest with http://
  if (!testUrl) url='http://'+url; testUrl=urlp.parse(url).host
  if (!testUrl) return false
  return url
}

//Evaluate domain
app.get("/new/*", function(req, res){
  //validate url
  var vURL=validate(req.url)
  if (!vURL) {res.type('application/json'); return res.json({"error":"Invalid URL, cannot be saved"});}
  //Valid URL, search record
  cDB(function(db){
    var shortURL = db.collection("urls").findOne({"original_url":vURL}, function(err, shortURL){
      if (err) throw err
      if(!shortURL){
        saveURL(vURL)
        //res.send("Saving URL")
      } else {
        res.type('application/json')
        return res.send({"original_url":shortURL.original_url, "short_url":shortURL.short_url});
      }
      db.close()
    })
  })
  
  //Save URL
  function saveURL(url){
    cDB(function(db){
      var shortID = db.collection("urls").find({}, {"short_url":true}).sort({"_id":-1}).limit(1).toArray(function(err, data){
        if(err){throw(err)}
        var short_url=data[0].short_url+1
        //Saving new short url in DB
        db.collection("urls").insertOne({"short_url":short_url, "original_url":url}, function(err, r){
          if(err){throw(err)}
          db.close()
          return res.redirect('/new/'+url)
        })
      })
    })
  }
  
})
    
//Redirect
app.get("/*", function(req, res){
  var short_url=parseInt(req.url.split("/")[1])
  cDB(function(db){
    var shortURL = db.collection("urls").findOne({"short_url":short_url}, function(err, shortURL){
      if (err) throw err
      if(!shortURL){
        res.type("application/json")
        res.send({"error":"Not in the DB"})
      } else {
        res.redirect(shortURL.original_url)
      }
      db.close()
    })
  })
})


app.listen(process.env.PORT || 8080)