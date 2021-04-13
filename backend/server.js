//Imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const middleware = require('./middleware');
const cors = require('cors');
const bodyParser = require('body-parser');
const aws = require('aws-sdk');
const fs = require('fs');
const { Server } = require('http');

const credentials = fs.readFileSync('credentials.json');


// Start Server + Connect to Database
const dbUri = JSON.parse(credentials).mongodb.uri;
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to Database')
    const server = express();
    server.listen(80,'0.0.0.0', ()=>{
        console.log('HTTP Server Started');
        server.use(bodyParser.urlencoded({ extended: false }))
        server.use(bodyParser.json())
        server.use(express.static('../dist'));
        server.use('/', middleware.router)
        server.use('/', routes.router);
        server.set('view engine', 'ejs');

        console.log(JSON.parse(credentials).aws.accessKeyId)
        aws.config.update({ "accessKeyId": JSON.parse(credentials).aws.accessKeyId, "secretAccessKey": JSON.parse(credentials).aws.secretAccessKey, "region": "eu-central-1" });
        s3 = new aws.S3({apiVersion: '2006-03-01'});
        s3.listBuckets(function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data.Buckets);
            }
        });
    })
})
.catch((err)=>console.log(err));