//Imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');


// Start Server + Connect to Database
const server = express();
server.use(express.json());
server.set('view engine', 'ejs');
server.use(require("body-parser").json())
server.use('/', routes);
const dbUri = 'mongodb+srv://Admin:test123@mongodbcluster1.fosb0.mongodb.net/TestDB?retryWrites=true&w=majority'

mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to Database')
    server.listen(3000, ()=>{
        console.log('HTTP Server Started');
    })
})
.catch((err)=>console.log(err));