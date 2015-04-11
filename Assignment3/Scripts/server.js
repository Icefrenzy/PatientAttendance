// Author: Jan Kevin Munar
// ID: 300702645
// Course: COMP308-062

var express = require('express');
var app = express();
//var app = angular.module('patientAttendance', []);
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

/*
 *============The startup file for the project============
 *Will handle all server and client transactions using socket.io
 */


// Default directory for file referencing
app.use(express.static(path.join(__dirname, '/')));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/COMP308'), function (error) {
    if (error)
        console.log(error);
}

var Schema = mongoose.Schema;

var patientSchema = new Schema({
    first_name: String,
    last_name: String,
    age: String,
    created: String,
    modified: String

});

var visitSchema = new Schema({
    id: String,
    complaint: String,
    billing: Number
});

var Patient = mongoose.model('patients', patientSchema);
var patientFilter;


// Redirect client to index.html on startup
app.get('/', function (req, res) {
    res.sendFile(path.resolve('index.html'));
});

app.get('/getPatient', function (req, res) {
    //console.log(res);
    console.log("Getting Patient from DB...")
    Patient.find({}, function (err, data) {
        //console.log(data);
        //console.log(Patient.first_name);
        if (err)
            console.log(err);
        else {
            console.log(data);
            res.status(200).send(data);

        }
    });
});

app.post('/updatePatient', bodyParser.json(), function (req, res) {
    Patient.update({ _id: req.body._id }, {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age,
        created: req.body.created,
        modified: req.body.modified
    }, function (err, data) {
        if (err)
            console.log(err);
        else {
            console.log("Updating rows %d", data);
            res.sendStatus(200);
        }
    });

});

app.post('/deletePatient', bodyParser.json(), function (req, res) {

    Patient.findOneAndRemove({_id: req.body._id}, function (err, data) {
        if (err)
            console.log(err);
        else
            console.log('Deleted user ID: ' + req.body._id);
        res.sendStatus(200);
    });

});

app.post('/savePatient',bodyParser.json(), function (req, res) {
    
    var newpatient = new Patient({
        "first_name": req.body.first_name,
        "last_name" : req.body.last_name,
        "age" : req.body.age,
        "created" : req.body.created,
        "modified" : req.body.modified
    });
    
    //console.log(newpatient);
    

    newpatient.save(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
        res.sendStatus(200);
    });
    
});

// Listening port
http.listen(3000, function () {
    console.log('Listening on *:3000');
});