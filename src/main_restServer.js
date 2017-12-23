var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var teacherRestRouter = require('./rest/route/teacherRestRouter');

var studentMongodbCollection = mongoose.connect("mongodb://localhost:27017/teacherDb");
// NOTE ilker set CORS variables 
var corsWhiteListDomains = ['http://localhost:4200']; // let an angular app running running on default port 4200 come through
var corsOptionsDelegate = function(req, callback) {
    var corsOptions;
    if (corsWhiteListDomains.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }; // ALLOW - enable the requested origin in CORS response for this request
    } else {
        corsOptions = { origin: false }; // STOP - disable CORS for this request.
    }
    callback(null, corsOptions); // NOTE 1st arg is error, 2nd options
};

var app = express();
// app.use(cors()); // NOTE ilker allow cross origin requests coming from any domain
app.use(cors(corsOptionsDelegate)); // NOTE ilker allow cross origin requests coming from domains in corsWhiteListDomains
// app.use('/students', studentRestRouter); // NOTE ilker important - make sure body-parser is specified before router. Otherwise you get undefined request.body in router
app.use(bodyParser.urlencoded({ extended: true })); // NOTE ilker to parse application/x-www-form-urlencoded, coming from form POSTs
app.use(bodyParser.json()); // NOTE ilker to parse application/json coming from REST clients
app.use('/fdu/api/v1/teachers', teacherRestRouter); // ********************** what directory should these be pointing too?
app.use('/api/v1/teachers', teacherRestRouter); // ************************

var portNumber = 9016;
app.listen(portNumber, function() {
    console.log("REST server running on port %s", portNumber);
});