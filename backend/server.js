//Imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');

// Start Server + Connect to Database
const dbUri = 'mongodb+srv://Admin:test123@mongodbcluster1.fosb0.mongodb.net/TestDB?retryWrites=true&w=majority'
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to Database')
    const server = express();
    server.listen(3000, ()=>{
        console.log('HTTP Server Started');
        server.use(cors({
            origin: 'http://'+process.env.IP+':3000',
            credentials: true,
            optionsSuccessStatus: 200
          }));
        server.use(bodyParser.json());
        server.use('/', routes.router);
        server.set('view engine', 'ejs');
    })
})
.catch((err)=>console.log(err));