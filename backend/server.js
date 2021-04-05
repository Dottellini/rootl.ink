//Imports
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');

// Start Server + Connect to Database
const server = express();
server.use(express.json());
server.set('view engine', 'ejs');
const dbUri = 'mongodb+srv://Admin:test123@mongodbcluster1.fosb0.mongodb.net/TestDB?retryWrites=true&w=majority'





mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to Database')
    server.listen(3000, ()=>{
        console.log('HTTP Server Started');
        server.options(cors({
            methods: ['GET'],
            exposedHeaders: ['X-Test'],
            origin: '*',
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
          }));
        server.use('/', routes.router);
        
    })
})
.catch((err)=>console.log(err)); 