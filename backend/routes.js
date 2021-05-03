const router = require('express').Router();
const { Readable } = require('stream')
const {compare, hash} = require('bcrypt');
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
require('./passport');


router.post('/failed', (req, res) => {
    res.send('<h1>Log in Failed :(</h1>')
});

router.post('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.post('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    function(req, res) {
        res.redirect('/');
    }
);

router.post('/api/analytics/get/*', (req,res)=>{
    console.log("1#"+req.url)
    console.log(req.url.replace('/api/analytics/get/',''))
    dynamodb.getItem({Key:{"url":{"S": req.url.replace('/api/analytics/get/','')}},TableName: "Analytics"},(err, data)=>{
        console.log(err,data)
        res.status(200).json(data)
    });
});

router.post('/api/analytics/*', (req,res)=>{
    console.log(req.body)
    //Check if Page Analytics exist
    dynamodb.getItem({Key:{"url":{"S": req.url.replace('/api/analytics/','')}},TableName: "Analytics"},(err, data)=>{
        if(req.body.event == "Page Viewed") {
            console.log("Page Viewed")
            dynamodb.updateItem({
                TableName: "Analytics",
                Key: { "url": { S: req.url.replace('/api/analytics/','') } },
                UpdateExpression:'ADD #VALUE :inc',
                ExpressionAttributeNames:{
                    '#VALUE': "pageViews",
                },
                ExpressionAttributeValues:{
                    ':inc': {"N":"1"},
    
                },
                ReturnValues:'UPDATED_NEW'
            },()=>{})
            res.status(200).json(JSON.stringify(data));
            return;
        }
        if(req.body.event == "Link Clicked"){
            console.log("Link Clicked")

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
            },(err,data)=>{
                console.log(err,data)
                //Increment Year-Key by One
                dynamodb.updateItem({
                    TableName: "Analytics",
                    Key: { "url": { S: req.url.replace('/api/analytics/','') } },
                    UpdateExpression:'ADD #VALUE.#FIELD :inc',
                    ExpressionAttributeNames:{
                        '#VALUE': new Date().getFullYear().toString(),
                        '#FIELD': req.body.parameters.linkId.toString(),
                    },
                    ExpressionAttributeValues:{
                        ':inc': {"N":"1"},
        
                    },
                    ReturnValues:'UPDATED_NEW'
                },(err,data)=>{console.log(err,data)})
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
            },(err,data)=>{
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
                },(err,data)=>{
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
            },(err,data)=>{
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
                },(err,data)=>{
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

router.post('/login', (req,res)=>{
    console.log(req.body.username.toLowerCase())
    dynamodb.getItem({Key:{"usernameLowerCase":{S:req.body.username.toLowerCase()}},TableName: "Users"},(err, data)=>{
        console.log("Test")
        console.log(err, data)
        if(Object.keys(data).length == 0){
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
            const refreshToken = sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' });
            data.Item.refreshToken.S = refreshToken;
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
            if(data.Item.emailAddressConfirmed.BOOL){
                res.status(200).json({'result':'OK', 'username':data.Item.username.S})
                return;
            }
            res.status(200).json({'result':'WARNING', 'message': 'Email Address not confirmed yet','username':data.Item.username.S})
            return;
        });
    })
});

router.post('/testLogin', (req, res)=>{
    res.json({'username': res.locals.user, 'result':'OK'});
});

router.post('/logout', (req,res)=>{
    //set refresh token in db to ""
    res.status(200).json({'result':'OK'});
});

router.post('/confirmEmailAddress', (req, res)=>{
    console.log("KEY:"+req.body.username.toLowerCase())
    dynamodb.getItem({Key:{"usernameLowerCase":{"S":req.body.username.toLowerCase()}},TableName: "Users"},(err, data)=>{
        if(Object.keys(data).length == 0){
            res.status(401).json({'result':'ERROR', 'message': 'Account not found'});
            return;
        }
        console.log(data.Item.confirmationCode.S,req.body.code)
        if(data.Item.confirmationCode.S!=req.body.code){
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
        },(err, data)=>{
                console.log(err,data)
                res.status(200).json({'result':'OK'});
                return;        
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
            if(data.Items.length!=0){
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
                    },TableName:"Users"},(err, data)=>{
                        dynamodb.putItem({
                            Item:{
                                [req.body.username]:{"NULL":true},
                            },
                            TableName:"Analytics"                
                        },(err,data)=>{
                            console.log(err,data);
                        })
                })
                renderFile(__dirname+'/email-templates/email-template1.ejs', {code: confirmationCode, username:req.body.username},(error, data)=>{
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
    dynamodb.getItem({Key:{"usernameLowerCase":{"S": res.locals.user.username.toLowerCase()}},TableName: "Users"},(err, data)=>{
        console.log(err, data)
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

router.post('/analytics', (req,res)=>{
    console.log("ertguiowegirhirehg")
    console.log(req.headers)
    console.log(req.headers.referer.split('/')[3])
    dynamodb.updateItem({
        TableName: "Analytics",
        Key: { "url": { S: req.headers.referer.split('/')[3] } },
        ExpressionAttributeValues: { ":inc": {N: "1"} },
        UpdateExpression: "ADD pageViews :inc"
      }, (err, data)=>{
          console.log(err,data)
      })
})

exports.router = router;