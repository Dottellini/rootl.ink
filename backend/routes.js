const router = require('express').Router();
const { Readable } = require('stream')
const {compare, hash} = require('bcryptjs');
const {sign} = require('jsonwebtoken');
const {v4} = require('uuid');
const {renderFile} = require('ejs');
const {createTransport} = require('nodemailer');
const aws = require('aws-sdk');
const {readFileSync} = require('fs');
const credentials = JSON.parse(readFileSync('credentials.json'));
aws.config.update({ "accessKeyId": credentials.aws.accessKeyId, "secretAccessKey": credentials.aws.secretAccessKey, "region": "eu-central-1" });
const dynamodb = new aws.DynamoDB({apiVersion: '2012-08-10'});
const passport = require('passport');
const fetch = require('node-fetch')
const UAParser = require('ua-parser-js')
require('./passport');


router.post('/failed', (req, res) => {
    res.send('<h1>Log in Failed :(</h1>')
});

router.post('/resetPassword', (req,res)=>{
    console.log(req.body)
    dynamodb.getItem({Key:{"usernameLowerCase":{"S": req.body.username.toLowerCase()}},TableName: "Users"},(err, data)=>{
        console.log("2",err,data)
        if(data === {}){
            console.log(":(")
            res.status(418).json({})
            return
        }
        if(typeof data.Item.passwordResetCode === 'undefined'){
            console.log(":(")
            res.status(418).json({})
            return
        }
        if(data.Item.passwordResetCodeExpiry.N < new Date().getTime()/1000){
            console.log(":(")
            res.status(418).json({})
            return
        }
        if(req.body.resetCode === data.Item.passwordResetCode.S){
            console.log(":)")
            hash(req.body.newPassword, 10, function(error, hash) {
                console.log(error, hash)
                dynamodb.updateItem({
                    TableName: "Users",
                    Key: { "usernameLowerCase": { S: req.body.username.toLowerCase() } },
                    UpdateExpression: 'SET #a = :value , #b = :secondValue , #c = :thirdValue',
                    ExpressionAttributeValues: {
                        ":value":  { S:hash },
                        ":secondValue":  { S:"" },
                        ":thirdValue":  { S:"" }
                    },
                    ExpressionAttributeNames: {
                        '#a': "passwordHash",
                        '#b': "passwordResetCode",
                        '#c': "passwordResetCodeExpiry"
                    }
                },(err,data)=>{console.log(err,data)})
            })


            res.status(200).json({})
        } else {
            console.log(":(")
            res.status(418).json({})
        }
    })
})

router.post('/requestPasswordReset', (req,res)=>{
    console.log(req.body)
    const code = v4()
    renderFile(__dirname+'/email-templates/email-template2.ejs', {code: code},(error, data)=> {
        let mailOptions = {
            from: 'rootlink.test123@gmail.com',
            to: req.body.email,
            subject: 'Reset Password - Rootl.ink',
            text: data,
            html: data
        };
        let emailSender = createTransport({
            service: 'gmail',
            auth: {
                user: 'rootlink.test123@gmail.com',
                pass: 'W6Jg4ZCzUswdAiXKckUJfVT3FzyK4cHtvHQEUu'
            }
        });
        emailSender.sendMail(mailOptions, function (error) {
            if (error) {
                console.log(error)
                res.status(500).json({'result': 'ERROR', 'message': 'Cant send reset email'});
                return;
            }
            res.status(200).json({'result': 'OK'});
        });
    })

    dynamodb.updateItem({
        TableName: "Users",
        Key: { "usernameLowerCase": { S: req.body.username.toLowerCase() } },
        UpdateExpression: 'SET #a = :value , #b = :secondValue',
        ExpressionAttributeValues: {
            ":value":  { S:code },
            ":secondValue":  { N:(new Date().getTime()/1000+900).toString()},
        },
        ExpressionAttributeNames: {
            '#a': "passwordResetCode",
            '#b': "passwordResetCodeExpiry"
        }
    },(err,data)=>{
        console.log("1",err,data)
    })
})

router.post('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.post('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),(req,res)=> {
    res.redirect('/');
});

router.post('/api/analytics/get/', (req,res)=>{
    dynamodb.getItem({Key:{"url":{"S": res.locals.user.username.toLowerCase()}},TableName: "Analytics"},(err, data)=>{
        res.status(200).json(data)
    });
});

router.post('/gethtml*',(req,res)=>{
    fetch(req.url.replace('/gethtml?url=','')).then(data =>data.text())
    .then(data=>{
        res.send(data)
    })
})

router.post('/api/analytics/*', (req,res)=>{
    //Check if Page Analytics exist
    dynamodb.getItem({Key:{"url":{"S": req.url.replace('/api/analytics/','')}},TableName: "Analytics"},(err, data)=>{
        if(req.body.event === "Page Viewed") {
            let userAgent = new UAParser(req.body.parameters.userAgent)
            dynamodb.updateItem({
                TableName: "Analytics",
                Key: { "url": { S: req.url.replace('/api/analytics/','') } },
                UpdateExpression:'ADD #PAGEVIEWS :inc, #BROWSERS.#BROWSER :inc, #OPERATINGSYSTEMS.#OPERATINGSYSTEM :inc',
                ExpressionAttributeNames:{
                    '#PAGEVIEWS': "pageViews",
                    '#BROWSERS': "browsers",
                    '#BROWSER': userAgent.getBrowser().name,
                    '#OPERATINGSYSTEMS': "operatingSystems",
                    '#OPERATINGSYSTEM': userAgent.getOS().name
                },
                ExpressionAttributeValues:{
                    ':inc': {"N":"1"},
    
                },
                ReturnValues:'UPDATED_NEW'
            },()=>{})
        }
        if(req.body.event === "Link Clicked"){

            //Create Year-Key if not existing
            dynamodb.updateItem({
                TableName: "Analytics",
                Key: { "url": { S: req.url.replace('/api/analytics/','') } },
                UpdateExpression: 'SET #a = :value',
                ConditionExpression: 'attribute_not_exists(#a)',
                ExpressionAttributeValues: {
                    ":value":  { M: {} },
                },
                ExpressionAttributeNames: {
                    '#a': new Date().getFullYear().toString()
                }
            },()=>{
                //Increment Year-Key by One
                dynamodb.updateItem({
                    TableName: "Analytics",
                    Key: { "url": { S: req.url.replace('/api/analytics/','') } },
                    UpdateExpression:'ADD #TIME.#LINKID :increment',
                    ExpressionAttributeNames:{
                        '#TIME': new Date().getFullYear().toString(),
                        '#LINKID': req.body.parameters.linkId.toString()
                    },
                    ExpressionAttributeValues:{
                        ':increment': {"N":"1"},
        
                    },
                    ReturnValues:'UPDATED_NEW'
                },()=>{})
            });

            //Create Month-Key if not existing
            dynamodb.updateItem({
                TableName: "Analytics",
                Key: { "url": { S: req.url.replace('/api/analytics/','') } },
                UpdateExpression: 'SET #a = :value',
                ConditionExpression: 'attribute_not_exists(#a)',
                ExpressionAttributeValues: {
                    ":value":  { M: {} },
                },
                ExpressionAttributeNames: {
                    '#a': `${new Date().getFullYear().toString()}-${(new Date().getMonth()+1).toString()}`
                }
            },()=>{
                //Increment Month-Key by One
                dynamodb.updateItem({
                    TableName: "Analytics",
                    Key: { "url": { S: req.url.replace('/api/analytics/','') } },
                    UpdateExpression:'ADD #VALUE.#FIELD :inc',
                    ExpressionAttributeNames:{
                        '#VALUE': `${new Date().getFullYear().toString()}-${(new Date().getMonth()+1).toString()}`,
                        '#FIELD': req.body.parameters.linkId.toString(),
                    },
                    ExpressionAttributeValues:{
                        ':inc': {"N":"1"},
        
                    },
                    ReturnValues:'UPDATED_NEW'
                },()=>{
                })
            });

            //Create Day-Key if not existing
            dynamodb.updateItem({
                TableName: "Analytics",
                Key: { "url": { S: req.url.replace('/api/analytics/','') } },
                UpdateExpression: 'SET #a = :value',
                ConditionExpression: 'attribute_not_exists(#a)',
                ExpressionAttributeValues: {
                    ":value":  { M: {} },
                },
                ExpressionAttributeNames: {
                    '#a': `${new Date().getFullYear().toString()}-${(new Date().getMonth()+1).toString()}-${new Date().getDate().toString()}`
                }
            },()=>{
                //Increment Day-Key by One
                dynamodb.updateItem({
                    TableName: "Analytics",
                    Key: { "url": { S: req.url.replace('/api/analytics/','') } },
                    UpdateExpression:'ADD #VALUE.#FIELD :inc',
                    ExpressionAttributeNames:{
                        '#VALUE': `${new Date().getFullYear().toString()}-${(new Date().getMonth()+1).toString()}-${new Date().getDate().toString()}`,
                        '#FIELD': req.body.parameters.linkId.toString(),
                    },
                    ExpressionAttributeValues:{
                        ':inc': {"N":"1"},
        
                    },
                    ReturnValues:'UPDATED_NEW'
                },()=>{
                })
            });
        }
        res.status(200).json(JSON.stringify(data));
    });
})

router.get('/checkUserPage?id=*', (req, res)=>{
    let params = {
        Bucket: "rootlinkdata", 
        Key: '${req.query.id}.json'
    }
    new aws.S3({apiVersion: '2006-03-01'}).headObject(params, function (err) {
        if (err && err.code === 'NotFound') {
            res.status(404).json({'result': 'ERROR', 'message': 'Not Found'})
            return;
        }
        res.json({'result':'OK'})
    })
});

router.post('/login', (req,res)=>{
    dynamodb.getItem({Key:{"usernameLowerCase":{S:req.body.username.toLowerCase()}},TableName: "Users"},(err, data)=>{
        if(Object.keys(data).length === 0){
            res.cookie('accessToken', '', {
                httpOnly: true,
            });
            res.status(401).json({'result':'ERROR','message': 'Account not found'})
            return;
        }
        compare(req.body.password, data.Item.passwordHash.S, function(err, passwordResult) {
            if(!passwordResult) {
                res.cookie('accessToken', '', {
                    httpOnly: true,
                });
                res.status(401).json({'result':'ERROR','message': 'Wrong password'})
                return;
            }
            const payload = {username:req.body.username};
            const accessToken = sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
            dynamodb.updateItem({
                TableName:"Users",
                Key: { "usernameLowerCase": { S: req.body.username.toLowerCase() } },
                UpdateExpression: 'SET #a = :value',
                ExpressionAttributeValues: {
                    ":value":  { S: refreshToken },
                },
                ExpressionAttributeNames: {
                    '#a': "refreshToken"
                }
            },()=>{});
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
            });
            if(data.Item.emailAddressConfirmed.BOOL){
                res.status(200).json({'result':'OK', 'username':data.Item.username.S})
                return;
            }
            res.status(200).json({'result':'WARNING', 'message': 'Email Address not confirmed yet','username':data.Item.username.S})
        });
    })
});

router.post('/testLogin', (req, res)=>{
    res.json({'username': res.locals.user, 'result':'OK'});
});

router.post('/logout', (req,res)=>{
    res.status(200).json({'result':'OK'});
});

router.post('/confirmEmailAddress', (req, res)=>{
    dynamodb.getItem({Key:{"usernameLowerCase":{"S":req.body.username.toLowerCase()}},TableName: "Users"},(err, data)=>{
        if(Object.keys(data).length === 0){
            res.status(401).json({'result':'ERROR', 'message': 'Account not found'});
            return;
        }
        if(data.Item.confirmationCode.S!==req.body.code){
            res.status(401).json({'result':'ERROR', 'message': 'Invalid confirmation code'});
            return;
        }
        dynamodb.updateItem({
            TableName: "Users",
            Key: {
                "usernameLowerCase": {S: req.body.username.toLowerCase()}
            },
            UpdateExpression: "set #emailAddressConfirmed  = :true",
            ExpressionAttributeNames: {
                "#emailAddressConfirmed": "emailAddressConfirmed"
            },
            ExpressionAttributeValues:{
                ":true": {BOOL: true}
            }
        },()=>{
                res.status(200).json({'result':'OK'});
        });
    });
});

router.post('/register', (req,res)=>{
    const invalidUsernames = ["login","register","about","help","pricing","service"]
    if(invalidUsernames.includes(req.body.username.toLowerCase())){
        res.status(403).json({'result':'ERROR', 'message': 'Invalid Username'});
        return;
    }
    dynamodb.getItem({Key:{"usernameLowerCase":{"S": req.body.username.toLowerCase()}},TableName: "Users"},(err, data)=>{
        if(Object.keys(data).length !== 0){
            res.status(403).json({'result':'ERROR', 'message': 'Username already exists'});
            return;
        }
        dynamodb.query({TableName:"Users",IndexName:"emailAddress-index",Select:'ALL_PROJECTED_ATTRIBUTES',KeyConditionExpression:'emailAddress = :emailAddress',ExpressionAttributeValues:{":emailAddress": {"S": req.body.email.toLowerCase()}}}, (err, data)=>{
            if(data.Items.length!==0){
                res.status(403).json({'result':'ERROR', 'message': 'Email Address already in use'});
                return;
            }
            const confirmationCode = v4();
            hash(req.body.password, 10, function(error, hash) {
                dynamodb.putItem({
                    Item:{
                        "emailAddress":{S: req.body.email},
                        "username":{S: req.body.username},
                        "usernameLowerCase":{S:req.body.username.toLowerCase()},
                        "emailAddressConfirmed":{BOOL: false},
                        "passwordHash":{S: hash},
                        "refreshToken": {S: ""},
                        "confirmationCode":{S:confirmationCode},
                        "userPageUrl":{S:req.body.username.toLowerCase()}
                    },TableName:"Users"},()=>{
                        dynamodb.putItem({
                            Item:{
                                "url":{"S":req.body.username.toLowerCase()},
                                "pageViews":{"N":"0"},
                                "browsers":{"M":{}},
                                "operatingSystems":{"M":{}}
                            },
                            TableName:"Analytics"
                        },()=>{})
                })
                renderFile(__dirname+'/email-templates/email-template1.ejs', {code: confirmationCode, username:req.body.username},(error, data)=>{
                    let mailOptions = {
                        from: 'rootlink.test123@gmail.com',
                        to: req.body.email,
                        subject: 'Confirm Your Email Address - Rootl.ink',
                        text: data,
                        html: data
                    };
                    let emailSender = createTransport({
                        service: 'gmail',
                        auth: {
                        user: 'rootlink.test123@gmail.com',
                        pass: 'W6Jg4ZCzUswdAiXKckUJfVT3FzyK4cHtvHQEUu'
                        }
                    });                
                    emailSender.sendMail(mailOptions, function(error){
                        if (error) {
                            console.log(error)
                            res.status(500).json({'result':'ERROR', 'message': 'Cant send confirmation email'});
                            return;
                        }
                        res.status(200).json({'result':'OK'});
                    });
                });        
            })
        })
    });
});

router.post('/createPage', (req, res)=>{
    let filename;
    dynamodb.getItem({Key:{"username":{"S": res.locals.user.username}},TableName: "Users"},()=>{
        filename = res.locals.user.username.toLowerCase()+'.json';
        let readable = Readable.from([JSON.stringify(req.body)])
        readable.on('error', ()=> {
            res.status(500).json({'result':'ERROR', 'message': 'Cant read data'});
        });
        let uploadParams = {Bucket: 'rootlinkdata', Key: filename, Body: readable, ACL: 'public-read'};
        let s3 = new aws.S3({
            apiVersion: '2006-03-01',
            params: {Bucket: 'rootlinkdata'}
        });
        s3.upload (uploadParams, function (err, data) {
            if(err){
                res.status(500).json({'result':'ERROR', 'message': 'Cant upload data'});

                return;
            }if(data){
                res.status(200).json({'result':'OK'});
            }
        });
    });
});

router.post('/uploadProfilePicture', (req,res)=>{
    let filename;
    dynamodb.getItem({Key:{"usernameLowerCase":{"S": res.locals.user.username.toLowerCase()}},TableName: "Users"},()=>{
        filename = res.locals.user.username.toLowerCase()+'.profilepicture.txt';
        let readable = Readable.from([JSON.stringify(req.body)])
        readable.on('error', ()=>{
            res.status(500).json({'result':'ERROR', 'message': 'Cant read data'});
        });
        let uploadParams = {Bucket: 'rootlinkdata', Key: filename, Body: readable, ACL: 'public-read'};
        let s3 = new aws.S3({
            ACL:'public-read',
            apiVersion: '2006-03-01',
            params: {Bucket: 'rootlinkdata'}
        });
        s3.upload (uploadParams, function (err, data) {
            if(err){
                res.status(500).json({'result':'ERROR', 'message': 'Cant upload data'});
                return;
            }if(data){
                res.status(200).json({'result':'OK'});
            }
        });
    });
});

router.post('/analytics', (req)=>{
    dynamodb.updateItem({
        TableName: "Analytics",
        Key: { "url": { S: req.headers.referer.split('/')[3] } },
        ExpressionAttributeValues: { ":inc": {N: "1"} },
        UpdateExpression: "ADD pageViews :inc"
      }, ()=>{
      })
})

exports.router = router;