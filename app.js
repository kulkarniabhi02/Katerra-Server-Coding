var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
const csv=require('csvtojson')
var app = express();

var arrUploadedDocument = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post("/api/v1/upload_csv", multer({dest: "./uploads/"}).array("uploads[]", 12), function(req, res) {
    const customResponse = {
        'name': req.files[0].originalname,
        'result': true,
        'id': req.files[0].filename,
        'originalname': req.files[0].originalname,
        'Errors': ""
    }
    arrUploadedDocument[req.files[0].filename] = req.files[0];
    res.send(customResponse);
});

app.get('/api/v1/data/:id', function(req, res) {
    customResponse = arrUploadedDocument[req.params.id]
    const csvFilePath='./uploads/' + req.params.id
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            res.send(jsonObj);
        })
});

var server = app.listen(3000, function() {
    console.log("Listening on port %s...", server.address().port);
});