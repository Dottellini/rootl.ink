const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const account = require('./db-models/account');
const fs = require('fs');
const { Readable } = require("stream")
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const aws = require('aws-sdk');




{
    /*router.get('/', (req, res)=>{
    res.sendFile('./views/index.html', {'root': __dirname});
});

router.get('/register', (req, res)=>{
    res.sendFile('./views/register.html', {'root': __dirname});
});

router.get('/createPage', (req, res)=>{
    res.sendFile('./views/createPage.html', {'root': __dirname});
});

router.get('/login', (req,res)=>{
    res.sendFile('/views/login.html', {'root':__dirname});
});

*/
}

//Get

router.get('/testLogin', (req, res)=>{
    res.sendFile('./views/testLogin.html', {'root': __dirname});
});

router.get('/confirmEmailCode*', (req,res)=>{
    res.sendFile('./views/confirmEmail.html', {'root': __dirname});
});

router.get('/logout', (req,res)=>{
    res.sendFile('./views/logout.html', {'root': __dirname});
});

router.get('/p/*', (req, res)=>{
    res.sendFile('/views/template1.html', {'root':__dirname});
});

router.get('*', (req,res)=>{
    let params = {
        Bucket: "rootlinkdata", 
        Key: req.url.replace('/', '')+'.json'
       }
    new aws.S3({apiVersion: '2006-03-01'}).headObject(params, function (err, metadata) {  
        if (err && err.code === 'NotFound') {  
          res.status(404).send('404');
          return;
        }
        res.sendFile('./views/template1.html', {'root': __dirname});
    })
});

//Post

router.post('/login', (req,res)=>{
    console.log(req)
    account.AccountSchema.find({email:req.body.email}).then(results=>{
        if(!results.length){
            res.cookie('accessToken', '', {
                httpOnly: true,
            });
            res.status(401).send('Account not found')
            return;
        }
        bcrypt.compare(req.body.password, results[0].password_hash, function(err, PasswordResult) {
            if(!PasswordResult) {
                res.cookie('accessToken', '', {
                    httpOnly: true,
                });
                res.status(403).send('Wrong Password');
                return;
            }
            const payload = {email: req.body.email};
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' });
            results[0].refresh_token = refreshToken;
            results[0].save();
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
            });
            res.status(200).send('Logged in')
            return;
        });
    })

});

router.post('/confirmEmail', (req, res)=>{
    account.AccountSchema.find({email:req.body.email}).then(result=>{
        if(result.length==0){
            res.status(401).send('Account not found');
            return;
        }
        if(result[0].confirmation_code!=req.body.code){
            res.status(400).send('Invalid Confirmation Code');
            return;
        }
        result[0].email_confirmed=true;
        result[0].confirmation_code=undefined;
        result[0].save();
        res.status(200).send('Email Adress Confirmed');
        return;
    })
});

router.post('/register', (req,res)=>{
    // account.AccountSchema.find({$or:[{email: req.body.email},{username: req.body.username}]}, (error, accounts)=>{
    account.AccountSchema.find({email: req.body.email}, (error, accounts)=>{
        if(error){
            res.status(500).send('Error fetching accounts');
            return;
        }
        if(accounts.length!=0){
            res.status(403).send('Account already exists');
            return;
        }
        const confirmationCode = uuid.v4();
        bcrypt.hash(req.body.password, 10, function(error, hash) {
            console.log(req.body.username.indexArrayForSpaces.length)
            if(req.body.username.indexArrayForSpaces.length == 0){
                req.body.username = req.body.username.username
            }
            let Account = new account.AccountSchema({
                password_hash: hash,
                email: req.body.email,
                username: req.body.username,
                email_confirmed: false,
                confirmation_code: confirmationCode
            });

            ejs.renderFile(__dirname+'/email-templates/email-template1.ejs', {code: confirmationCode, email:req.body.email},(error, data)=>{
                var mailOptions = {
                    from: 'rootlink.test123@gmail.com',
                    to: req.body.email,
                    subject: 'Confirm Your Email Adress - Rootl.ink',
                    text: data,
                    html: data
                };
                var emailSender = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'rootlink.test123@gmail.com',
                      pass: '%pFJM,hwr_b,uyv#,F?+66Hb'
                    }
                  });                
                emailSender.sendMail(mailOptions, function(error, info){
                    if (error) {
                        res.status(500).send('Error Sending Confirmation Email')
                    }
                });
            });
            Account.save();
            res.status(200).send('Account created')
        })
    });
});

router.post('/createPage', (req, res)=>{
    let filename;
    console.log(res.locals.user)
    account.AccountSchema.find({email:res.locals.user.email}).then(results=>{
        filename = results[0].username+'.json';
        let readable = Readable.from([JSON.stringify(req.body)])
        readable.on('error', function(err) {
            res.status(500).send('Error Reading Data')
            return;
        });
        let uploadParams = {Bucket: 'rootlinkdata', Key: filename, Body: readable, ACL: 'public-read'};
        s3.upload (uploadParams, function (err, data) {
            if(err){
                console.log(err)
                res.status(500).send('Error Uploading Data')
                return;
            }if(data){
                console.log('Uploaded Succefully')
                res.status(200).send('Uploaded Succefully')
                return;
            }
        });
    });
});

exports.router = router;