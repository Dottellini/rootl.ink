require('dotenv').config();
const account = require('./db-models/account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get(['/testLogin', '/createPage'], (req, res, next)=>{
    if(req.headers.cookie == undefined){
        res.status(401).send('Not Logged In');
        return;
    }
    if(parseCookies(req.headers.cookie).accessToken == undefined) {
        res.status(401).send('Not Logged In');
        return;
    }
    jwt.verify(parseCookies(req.headers.cookie).accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err == 'TokenExpiredError: jwt expired') {
            const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {ignoreExpiration: true} );
            const refresh = refreshAccessToken(payload.email);
            if(refresh instanceof Error){
                res.status(403).send('Invalid Token');
                return;
            }
            res.cookie('accessToken', refresh, {
                httpOnly: true,
            });
            next();
        }
        if(err){
            console.log(err)
            res.status(403).send('Error Validating Token');
            return;
        }
    })
});

function logout(req, res, next){
    console.log('HÄH')
    res.cookie('accessToken', '', {
        httpOnly: true,
    });
    res.cookie('refreshToken', '', {
        httpOnly: true,
    });
    next()
};

function login(emailAddress, password, callback) {
    account.AccountSchema.find({email:emailAddress}).then(results=>{
        console.log(results)
        if(!results.length){
            callback(1, 'Account not Found');
            return;
        }
        bcrypt.compare(password, results[0].password_hash, function(err, PasswordResult) {
            if(!PasswordResult) {
                callback(1, 'Password Wrong');
                return;
            }
            const payload = {email: emailAddress};
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
            results[0].refresh_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
            results[0].save();
            callback(2, accessToken, results[0].refresh_token.toString());
            return;
        });
    })
};

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
            let payload = {email: emailAddress}
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

exports.login = login;
exports.authenticateToken = authenticateToken;
exports.refreshAccessToken = refreshAccessToken;
exports.parseCookies = parseCookies;
exports.logout = logout;
exports.router = router;