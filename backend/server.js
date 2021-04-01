//Imports
const express = require('express');
const mongoose = require('mongoose');
const page = require('./db-models/page');
const jwt = require("jsonwebtoken");

// Start Server
const server = express();
server.use(express.json());
server.set('view engine', 'ejs');
server.use(require("body-parser").json())

//Connect to Database
const dbUri = 'mongodb+srv://Admin:test123@mongodbcluster1.fosb0.mongodb.net/TestDB?retryWrites=true&w=majority'
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => {
    console.log('Connected to Database')
    server.listen(3000, ()=>{
        console.log('HTTP Server Started');
    })
})
.catch((err)=>console.log(err))

//Routing
//Root
server.get('/', (req, res)=>{
    res.sendFile('./views/index.html', {'root': __dirname});
});

//Register

server.get('/register', (req, res)=>{
    res.sendFile('./views/register.html', {'root': __dirname});
});

//Create Page
server.get('/createPage', (req, res)=>{
     res.sendFile('./views/createPage.html', {'root': __dirname});
});

server.post('/createPage', (req, res)=>{
    const Data = req.body;
    const UserPage = new page.PageSchema({
        url: Data.url,
        account_id: Data.account_id,
        links: Data.links
    });
    UserPage.save();
});

//Userpages

server.get('/p/*.json', (req,res)=>{
    page.PageSchema.find({url: req.originalUrl.replace('/p/','').replace('.json','')})
    .then(result=>{
        console.log(result[0]);
        res.send(result[0]);
    })
});


server.get('/p/*', (req, res)=>{
    page.PageSchema.find({url: req.originalUrl.replace('/p/','')})
    .then(result=>{
        console.log(result);
        if(result.toString()==[]){
            res.sendStatus(404);
        } else{
            res.sendFile('./views/template1.html', {'root': __dirname});
        }
    });
});