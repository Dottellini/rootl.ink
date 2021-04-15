const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const account = require('./db-models/account');
const { Readable } = require('stream')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const ejs = require('ejs');
const {createTransport} = require('nodemailer');
const aws = require('aws-sdk');
const { check, validationResult, query } = require('express-validator');


//Get

router.get('/testLogin', (req, res)=>{
    res.json({'username': res.locals.user, 'result':'OK'});
});

router.get('/confirmEmailCode*', (req,res)=>{
    res.sendFile('./views/confirmEmail.html', {'root': __dirname});
});

router.get('/logout', (req,res)=>{
    res.sendFile('./views/logout.html', {'root': __dirname});
});

router.get('/checkUserPage?id=*', (req, res)=>{
    let params = {
        Bucket: "rootlinkdata", 
        Key: '${req.query.id}.json'
    }
    new aws.S3({apiVersion: '2006-03-01'}).headObject(params, function (err, metadata) {  
        if (err && err.code === 'NotFound') {
            res.status(404).json({'result': 'ERROR', 'message': 'Not Found'})
            return;
        }
        res.json({'result':'OK'})
    })
});


router.get('*', (req,res)=>{
    let params = {
        Bucket: "rootlinkdata", 
        Key: req.url.replace('/', '')+'.json'
       }
    new aws.S3({apiVersion: '2006-03-01'}).headObject(params, function (err, metadata) {  
        if (err && err.code === 'NotFound') {
            res.status(404).json({'result':'ERROR', 'message': 'Page not found'})
            return;
        }
        res.sendFile('./views/template1.html', {'root': __dirname});
    })
});

//Post
//router.post('/login',check('email').whitelist(['abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ','123456789', '.']), (req,res)=>{
router.post('/login', (req,res)=>{
    account.AccountSchema.find({email:req.body.email}).then(results=>{
        if(!results.length){
            res.cookie('accessToken', '', {
                httpOnly: true,
            });
            res.status(401).json({'result':'ERROR','message': 'Account not found'})
            return;
        }
        bcrypt.compare(req.body.password, results[0].password_hash, function(err, PasswordResult) {
            if(!PasswordResult) {
                res.cookie('accessToken', '', {
                    httpOnly: true,
                });
                res.status(401).json({'result':'ERROR','message': 'Wrong password'})
                return;
            }
            const payload = {email: req.body.email, username:req.body.username};
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
                res.status(200).json({'result':'OK', 'username':results[0].username, 'profilepicture': 'Not Implemented'})
                return;
            }
            else{
                res.status(200).json({'result':'WARNING', 'message': 'Email not confirmed yet','username':results[0].username, 'profilepicture': 'Not Implemented'})
                return;
            }
        });
    })

});

router.post('/confirmEmail', (req, res)=>{
    account.AccountSchema.find({email:req.body.email}).then(result=>{
        if(result.length==0){
            res.status(401).json({'result':'ERROR', 'message': 'Account not found'});
            return;
        }
        if(result[0].confirmation_code!=req.body.code){
            res.status(401).json({'result':'ERROR', 'message': 'Invalid confirmation code'});
            return;
        }
        result[0].email_confirmed=true;
        result[0].confirmation_code=undefined;
        result[0].save();
        res.status(200).json({'result':'OK'});
        return;
    })
});

router.post('/register', (req,res)=>{
    account.AccountSchema.find({$or:[{email: req.body.email},{username: /^req.body.username.toLowerCase()$/i}]}, (error, accounts)=>{
        if(error){
            res.status(500).json({'result':'ERROR', 'message': 'Cant fetch accounts'});
            return;
        }
        if(accounts.length!=0){
            res.status(403).json({'result':'ERROR', 'message': 'Account already exists'});
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
                var emailSender = createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'rootlink.test123@gmail.com',
                      pass: '%pFJM,hwr_b,uyv#,F?+66Hb'
                    }
                  });                
                emailSender.sendMail(mailOptions, function(error, info){
                    if (error) {
                        res.status(500).json({'result':'ERROR', 'message': 'Cant send confirmation email'});
                        return;
                    }
                });
            });
            Account.save();
            res.status(200).json({'result':'OK'});
        })
    });
});

router.post('/createPage', (req, res)=>{
    let filename;
    account.AccountSchema.find({email:res.locals.user.email}).then(results=>{
        filename = results[0].username.toLowerCase()+'.json';
        let readable = Readable.from([JSON.stringify(req.body)])
        readable.on('error', function(err) {
            res.status(500).json({'result':'ERROR', 'message': 'Cant read data'});
            return;
        });
        let uploadParams = {Bucket: 'rootlinkdata', Key: filename, Body: readable, ACL: 'public-read'};
        var s3 = new aws.S3({
            apiVersion: '2006-03-01',
            params: {Bucket: 'rootlinkdata'}
        });
        s3.upload (uploadParams, function (err, data) {
            if(err){
                res.status(500).json({'result':'ERROR', 'message': 'Cant upload data'});

                return;
            }if(data){
                res.status(200).json({'result':'OK'});
                return;
            }
        });
    });
});

router.post('/uploadProfilePicture', (req,res)=>{
    let filename;
    account.AccountSchema.find({email:res.locals.user.email}).then(results=>{
        filename = results[0].username.toLowerCase()+'profilepicture.txt';
        let readable = Readable.from([JSON.stringify(req.body)])
        readable.on('error', function(err) {
            res.status(500).json({'result':'ERROR', 'message': 'Cant read data'});
            return;
        });
        let uploadParams = {Bucket: 'rootlinkdata', Key: filename, Body: readable, ACL: 'public-read'};
        var s3 = new aws.S3({
            apiVersion: '2006-03-01',
            params: {Bucket: 'rootlinkdata'}
        });
        s3.upload (uploadParams, function (err, data) {
            if(err){
                res.status(500).json({'result':'ERROR', 'message': 'Cant upload data'});
                return;
            }if(data){
                res.status(200).json({'result':'OK'});
                return;
            }
        });
    });
});

exports.router = router;