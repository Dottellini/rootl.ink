require('dotenv').config();
const express = require('express');
const router = express.Router();
const account = require('./db-models/account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//authenticateToken
router.use(['/testLogin', '/createPage'], (req, res, next)=>{
    if(req.headers.cookie == undefined){
        res.set('X-Result','ERROR')
        res.status(401).json({'error':'Not logged in'});
        return;
    }
    let cookies = parseCookies(req.headers.cookie);
    if(cookies.accessToken == undefined) {
        res.set('X-Result','ERROR')
        res.status(401).json({'error':'Not logged in'});
        return;
    }
    jwt.verify(cookies.accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err){
            console.log(err.message)
            switch(err.message) {
                case 'jwt expired':
                    const payload = jwt.verify(cookies.accessToken, process.env.ACCESS_TOKEN_SECRET, {ignoreExpiration: true} );
                    const refresh = refreshAccessToken(payload.email);
                    if(refresh instanceof Error){
                        res.set('X-Result','ERROR')
                        res.status(401).json({'error':'Invalid token'});
                        return;
                    }
                    res.cookie('accessToken', refresh, {
                        httpOnly: true,
                    });
                    res.locals.user = user;
                    console.log(user)
                    next();
                    return;
                case 'jwt malformed':
                    res.cookie('accessToken', '', {
                        httpOnly: true,
                    });
                    res.cookie('refreshToken', '', {
                        httpOnly: true,
                    });
                    res.set('X-Result','ERROR')
                    res.status(401).json({'error':'Session Expired'});
                    return;
                default:
                    res.set('X-Result','ERROR')
                    res.status(403).json({'error':'Cant validate token'});
                    return;
            }
        }
        res.locals.user = user;
        console.log(user)

        next();
        return;
    })
});

//Logout
router.use('/logout', (req,res,next)=>{
    res.cookie('accessToken', '', {
        httpOnly: true,
    });
    res.cookie('refreshToken', '', {
        httpOnly: true,
    });
    next()
});

function refreshAccessToken(emailAddress){
    account.AccountSchema.find({email:emailAddress}).then(results=>{
        if(!results.length){
            let err = new Error('Account does not exist');
            err.status = 500;
            return err;

        }
        jwt.verify(results[0].refresh_token, process.env.ACCESS_TOKEN_SECRET, (err)=>{
            if(err) {
                let err = new Error('RefreshToken expired');
                err.status = 403;
                return err;
            }
            let payload = {email: emailAddress, username: results[0].username}
            let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            return accessToken;
        })
    })
};

function parseCookies(cookieString){
    cookieString = cookieString.split(';').map(v => v.split('=')).reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
        
    }, {});
    return cookieString;
};

exports.refreshAccessToken = refreshAccessToken;
exports.parseCookies = parseCookies;
exports.router = router;