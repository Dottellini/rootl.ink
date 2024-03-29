require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const middleware = require('./middleware');
const bodyParser = require('body-parser');
const history = require('connect-history-api-fallback');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passport');

if(false){
    let Mailchimp = require('mailchimp-api-v3')
    let mailchimp = new Mailchimp("6240aec66307b866ab3a34c81a78cfa-us1");
    mailchimp.post('https://us1.api.mailchimp.com/list/rootlink/members', {
        "email_address": "$test@gmail.edu",
        "status": "subscribed",
    })
}

const server = express();

server.listen(80,'0.0.0.0', ()=>{
    console.log('HTTP Server Started');
    addUses(server)
})

function addUses(server){
    ////////////////Google Auth Stuff
    //Configure Session Storage
    server.use(cookieSession({
        name: 'session-name',
        keys: ['key1', 'key2']
    }))

//Configure Passport
    server.use(passport.initialize());
    server.use(passport.session());
    /////////////////////////////////
    server.use(history());
    server.use(bodyParser.urlencoded({ extended: false }))
    server.use(bodyParser.json())
    server.use(express.static('../dist'));
    server.use('/', middleware.router)
    server.use('/', routes.router);
    server.set('view engine', 'ejs');
}