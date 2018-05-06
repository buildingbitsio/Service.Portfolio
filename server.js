var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var PORTFOLIOS_COLLECTION = "Portfolios";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

var db;

console.log("connectiong to: " + process.env.MONGO_URI);
mongodb.MongoClient.connect(process.env.MONGO_URI, function(err, database){
    if(err){
        console.log(err);
        process.exit(1);
    }
    db = database.db("properties");
    console.log("Database connection ready");

    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    })
});

function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason); 
    res.status(code || 500).json({"error": message});
}

app.get("/portfolios", function(req, res){
    const collection = db.collection(PORTFOLIOS_COLLECTION);

    collection.find({}).toArray(function(err, docs) {
        if(err){
            handleError(res, err.message, "Failed to get portfolios.");
        } else {
            res.status(201).json(docs);
        } 
    })
});

app.post("/portfolios", function(req, res){
    var newPortfolio = req.body;

    const collection = db.collection(PORTFOLIOS_COLLECTION);

    collection.insertOne(newPortfolio, function(err, doc){
        if(err){
            handleError(res, err.message, "Failed to create new portfolio.");
        } else {
            res.status(201).json(doc.ops[0]);
        }

    })
});

app.get("/address/:id", function(req, res){
});

app.put("/address/:id", function(req, res){
});