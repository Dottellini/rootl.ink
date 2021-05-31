require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs')
const aws = require('aws-sdk')
const fetch = require('node-fetch')
const credentials = JSON.parse(fs.readFileSync('credentials.json'));
aws.config.update({ "accessKeyId": credentials.aws.accessKeyId, "secretAccessKey": credentials.aws.secretAccessKey, "region": "eu-central-1" });
const dynamodb = new aws.DynamoDB({apiVersion: '2012-08-10'});


//authenticateToken
router.use(['/testLogin', '/createPage', '/uploadProfilePicture', '/api/analytics/get'], (req, res, next)=>{
  if(req.headers.cookie === undefined){
    res.status(401).json({'result': 'ERROR', 'message': 'Not logged in'})
    return;
  }
  let cookies = parseCookies(req.headers.cookie);
  if(cookies.refreshToken === undefined) {
    res.status(401).json({'result': 'ERROR', 'message': 'Not logged in'})
    return;
  }
  if(cookies.accessType === 'amazonLogin'){
    fetch(`https://api.amazon.com/user/profile`, {
      method: 'GET',
      headers:{
        'x-amz-access-token': cookies.accessToken,
        'Content-Type': 'application/json'
      }
    }).then(result=>result.json()).then(result=>{
      res.locals.user = result.user_id.replace('amzn1.account.','')
      next();
    })
  }else{
    jwt.verify(cookies.accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
      if(err){
        switch(err.message) {
          case 'jwt expired':
            const payload = jwt.verify(cookies.accessToken, process.env.ACCESS_TOKEN_SECRET, {ignoreExpiration: true});
            let refresh
            refreshAccessToken(payload.username, (result)=>{
              refresh = result
              if(refresh instanceof Error){
                res.status(401).json({'result': 'ERROR', 'message': 'Invalid token'})
                return;
              }
              res.cookie('accessToken', refresh, {
                httpOnly: true,
              });
              res.locals.user = user.username;
              next();
            });
            return;
          case 'jwt malformed':
            res.cookie('accessToken', '', {
              httpOnly: true,
            });
            res.cookie('refreshToken', '', {
              httpOnly: true,
            });
            res.status(401).json({'result': 'ERROR', 'message': 'Session expired'})
            return;
          default:
            res.status(403).json({'result': 'ERROR', 'message': 'Cant validate token'})
            return;
        }
      }
      res.locals.user = user.username;
      next();
    })
  }
});

//Logout
router.use('/logout', (req,res,next)=>{
  let cookies = parseCookies(req.headers.cookie);
  if(cookies.accessType === 'amazonLogin'){
    res.cookie('accessToken', '', {
      httpOnly: true,
    });
    res.cookie('refreshToken', '', {
      httpOnly: true,
    });
    res.cookie('accessType', '', {
      httpOnly: true,
    });
    next()
    return;
  }
  const payload = jwt.verify(cookies.accessToken, process.env.ACCESS_TOKEN_SECRET, {ignoreExpiration: true});
  dynamodb.updateItem({
    TableName:"Users",
    Key: { "usernameLowerCase": { S: payload.username.toLowerCase() } },
    UpdateExpression: 'SET #a = :value',
    ExpressionAttributeValues: {
      ":value":  { S: "" },
    },
    ExpressionAttributeNames: {
      '#a': "refreshToken"
    }
  },()=>{});
  res.cookie('accessToken', '', {
    httpOnly: true,
  });
  res.cookie('refreshToken', '', {
    httpOnly: true,
  });
  next()
});

function refreshAccessToken(username, callback){
  dynamodb.getItem({Key:{"usernameLowerCase":{"S": username.toLowerCase()}},TableName: "Users"},(err, data)=>{
    if(Object.keys(data).length === 0){
      let err = new Error('Account does not exist');
      err.status = 500;
      callback(err);
      return;
    }
    jwt.verify(data.Item.refreshToken.S, process.env.REFRESH_TOKEN_SECRET, (err)=>{
      if(err) {
        let err = new Error('RefreshToken expired');
        err.status = 403;
        callback(err);
      }
      let payload = {username: data.Item.username.S}
      callback(jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'}));
    })
  })
}

function parseCookies(cookieString){
  cookieString = cookieString.split(';').map(v => v.split('=')).reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;

  }, {});
  return cookieString;
}

exports.refreshAccessToken = refreshAccessToken;
exports.parseCookies = parseCookies;
exports.router = router;