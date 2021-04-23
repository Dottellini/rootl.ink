const express = require('express');
const router = express.Router();
const { Readable } = require('stream')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const ejs = require('ejs');
const {createTransport} = require('nodemailer');
const aws = require('aws-sdk');
const fs = require('fs');
const { DynamoDB } = require('aws-sdk');
//const helperFunctions = require('./helperFunctions')
const credentials = JSON.parse(fs.readFileSync('credentials.json'));
aws.config.update({ "accessKeyId": credentials.aws.accessKeyId, "secretAccessKey": credentials.aws.secretAccessKey, "region": "eu-central-1" });

var dynamodb = new aws.DynamoDB({apiVersion: '2012-08-10'});


//Get

router.get('/confirmEmailCode*', (req,res)=>{
    res.sendFile('./views/confirmEmail.html', {'root': __dirname});
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
router.post('/login', (req,res)=>{
    dynamodb.getItem({Key:{"username":{"S": req.body.username}},TableName: "Users"},(err, data)=>{
        if(Object.keys(data).length == 0){
            res.cookie('accessToken', '', {
                httpOnly: true,
            });
            res.status(401).json({'result':'ERROR','message': 'Account not found'})
            return;
        }
        bcrypt.compare(req.body.password, data.Items[0].passwordHash, function(err, passwordResult) {
            if(!passwordResult) {
                res.cookie('accessToken', '', {
                    httpOnly: true,
                });
                res.status(401).json({'result':'ERROR','message': 'Wrong password'})
                return;
            }
            const payload = {username:req.body.username};
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' });
            data.Items[0].refreshToken = refreshToken;
            dynamodb.putItem({
                Item:{
                    "refreshToken":{S: refreshToken},
                },
                TableName:"Users"
            },(err, data)=>{});
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
            });
            if(data.Items[0].emailConfirmed){
                res.status(200).json({'result':'OK', 'username':data.Items[0].username})
                return;
            }
            res.status(200).json({'result':'WARNING', 'message': 'Email not confirmed yet','username':data.Items[0].username})
            return;
        });
    })
});

router.post('/testLogin', (req, res)=>{
    res.json({'username': res.locals.user, 'result':'OK'});
});

router.post('/logout', (req,res)=>{
    res.status(200).json({'result':'OK'});
});

router.post('/confirmEmail', (req, res)=>{
    dynamodb.getItem({Key:{"username":{"S": req.body.username}},TableName: "Users"},(err, data)=>{
        if(Object.keys(data).length == 0){
            res.status(401).json({'result':'ERROR', 'message': 'Account not found'});
            return;
        }
        if(data.Item.confirmationCode!=req.body.code){
            res.status(401).json({'result':'ERROR', 'message': 'Invalid confirmation code'});
            return;
        }
        dynamodb.putItem({
            Item:{
                "emailConfirmed":{BOOL: true},
            },TableName:"Users"},(err, data)=>{
                res.status(200).json({'result':'OK'});
                return;        
        });
    });
});

router.post('/register', (req,res)=>{
    dynamodb.getItem({Key:{"username":{"S": req.body.username}},TableName: "Users"},(err, data)=>{
        if(Object.keys(data).length !== 0){
            res.status(403).json({'result':'ERROR', 'message': 'Account already exists'});
            return;
        }
        dynamodb.query({TableName:"Users",IndexName:"email-index",Select:'ALL_PROJECTED_ATTRIBUTES',KeyConditionExpression:'email = :email',ExpressionAttributeValues:{":email": {"S": req.body.email}}}, (err, data)=>{
            if(data.Items.length!=0){
                console.log(err,data)

                res.status(403).json({'result':'ERROR', 'message': 'Account already exists'});
                return;
            }
            const confirmationCode = uuid.v4();
            bcrypt.hash(req.body.password, 10, function(error, hash) {
                dynamodb.putItem({
                    Item:{
                        "email":{S: req.body.email},
                        "username":{S: req.body.username},
                        "emailConfirmed":{BOOL: false},
                        "passwordHash":{S: hash},
                        "refreshToken": {S: ""}
                    },TableName:"Users"},(err, data)=>{
                    ejs.renderFile(__dirname+'/email-templates/email-template1.ejs', {code: confirmationCode, username:req.body.username},(error, data)=>{
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
                            res.status(200).json({'result':'OK'});
                            return;
                        });

                    });        
                })
            })
        });
    });
});

router.post('/createPage', (req, res)=>{
    let filename;
    dynamodb.getItem({Key:{"username":{"S": res.locals.user.username}},TableName: "Users"},(err, data)=>{
        filename = res.locals.user.username.toLowerCase()+'.json';
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
    console.log(res.locals.user);
    dynamodb.getItem({Key:{"username":{"S": res.locals.user.username}},TableName: "Users"},(err, data)=>{
        filename = res.locals.user.username.toLowerCase()+'.profilepicture.txt';
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