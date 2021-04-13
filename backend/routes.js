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
    res.set('X-Result', 'OK')
    res.json({'username': res.locals.user});
});

router.get('/confirmEmailCode*', (req,res)=>{
    res.set('X-Result', 'OK')
    res.sendFile('./views/confirmEmail.html', {'root': __dirname});
});

router.get('/logout', (req,res)=>{
    res.set('X-Result', 'OK')
    res.sendFile('./views/logout.html', {'root': __dirname});
});

router.get('/p/*', (req, res)=>{
    res.set('X-Result', 'OK')
    res.sendFile('/views/template1.html', {'root':__dirname});
});

router.get('*', (req,res)=>{
    let params = {
        Bucket: "rootlinkdata", 
        Key: req.url.replace('/', '')+'.json'
       }
    new aws.S3({apiVersion: '2006-03-01'}).headObject(params, function (err, metadata) {  
        if (err && err.code === 'NotFound') {
            res.set('X-Result', 'ERROR')    
            res.status(404).json({'error': 'Page not found'})
            return;
        }
        res.set('X-Result', 'OK')    
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
            res.set('X-Result', 'ERROR');
            res.status(401).json({'error': 'Account not found'})
            return;
        }
        bcrypt.compare(req.body.password, results[0].password_hash, function(err, PasswordResult) {
            if(!PasswordResult) {
                res.cookie('accessToken', '', {
                    httpOnly: true,
                });
                res.set('X-Result', 'ERROR');
                res.status(403).json({'error': 'Wrong password'});
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
            if(results[0].email_confirmed){
                res.set('X-Result', 'OK')
            }
            else{
                res.set('X-Result', 'WARNING')
                res.status(200).json({'warning': 'Email not confirmed yet','username':results[0].username, 'profilepicture': 'Not Implemented'})
                return;
            }
            res.status(200).json({'username':results[0].username, 'profilepicture': 'Not Implemented'})
            return;
        });
    })

});

router.post('/confirmEmail', (req, res)=>{
    account.AccountSchema.find({email:req.body.email}).then(result=>{
        if(result.length==0){
            res.set('X-Result', 'ERROR')
            res.status(401).json({'error': 'Account not found'});
            return;
        }
        if(result[0].confirmation_code!=req.body.code){
            res.set('X-Result', 'ERROR')
            res.status(400).json({'error': 'Invalid confirmation code'});
            return;
        }
        result[0].email_confirmed=true;
        result[0].confirmation_code=undefined;
        result[0].save();

        res.set('X-Result', 'OK')
        res.status(200).json({});
        return;
    })
});

router.post('/register', (req,res)=>{
    account.AccountSchema.find({$or:[{email: req.body.email},{username: req.body.username}]}, (error, accounts)=>{
        if(error){
            res.set('X-Result', 'ERROR')
            res.status(500).json({'error':'Cant fetch accounts'});
            return;
        }
        if(accounts.length!=0){
            res.set('X-Result', 'ERROR')
            res.status(403).json({'error':'Account already exists'});
            return;
        }
        const confirmationCode = uuid.v4();
        bcrypt.hash(req.body.password, 10, function(error, hash) {
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
                        res.set('X-Result', 'ERROR')
                        res.status(500).json({'error':'Cant send confirmation Email'})
                    }
                });
            });
            Account.save();
            res.set('X-Result', 'OK')
            res.status(200).json({})
        })
    });
});

router.post('/createPage', (req, res)=>{
    let filename;
    account.AccountSchema.find({email:res.locals.user.email}).then(results=>{
        filename = results[0].username+'.json';
        let readable = Readable.from([JSON.stringify(req.body)])
        readable.on('error', function(err) {
            res.set('X-Result', 'ERROR')
            res.status(500).json({'error':'Cant read data'})
            return;
        });
        let uploadParams = {Bucket: 'rootlinkdata', Key: filename, Body: readable, ACL: 'public-read'};
        s3.upload (uploadParams, function (err, data) {
            if(err){
                res.set('X-Result', 'ERROR')
                res.status(500).json({'error':'Cant upload data'})
                return;
            }if(data){
                res.set('X-Result', 'OK')
                res.status(200).json({})
                return;
            }
        });
    });
});

exports.router = router;