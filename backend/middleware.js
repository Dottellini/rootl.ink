require('dotenv').config();
const account = require('./db-models/account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const ejs = require('ejs');
const nodemailer = require('nodemailer');

function authenticateToken(req, res, next){
    if(parseCookies(req.headers.cookie).accessToken == undefined) {
        res.status(401).send('Not Logged In');
        return;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
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
};

function confirmEmail(emailAddress, confirmationCode, callback){
    account.AccountSchema.find({email:emailAddress}).then(result=>{
        if(result.length==0){
            callback('No Account found');
        }
        if(result[0].confirmation_code!=confirmationCode){
            callback('Invalid Code');
        }
        result[0].email_confirmed=true;
        result[0].confirmation_code=undefined;
        result[0].save();
        callback('Email Confirmed');
    })
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

function register(emailAddress, password, callback) {
    account.AccountSchema.find({email:emailAddress}, (error, accounts)=>{
        if(error){
            callback('Error fetching Accounts');
            return;
        }
        if(accounts.length!=0){
            callback('Account already exists');
            return;
        }
        const confirmationCode = uuid.v4();
        bcrypt.hash(password, 10, function(error, hash) {
            let Account = new account.AccountSchema({
                password_hash: hash,
                email: emailAddress,
                email_confirmed: false,
                confirmation_code: confirmationCode
            });

            ejs.renderFile(__dirname+'/email-templates/email-template1.ejs', {code: confirmationCode, email:emailAddress},(error, data)=>{
                var mailOptions = {
                    from: 'rootlink.test123@gmail.com',
                    to: emailAddress,
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
                        callback('Error sending Confirmation Email');
                    }
                });
            });
            Account.save();
            callback('Account Created');
        })
    });

}

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
}
exports.login = login;
exports.authenticateToken = authenticateToken;
exports.confirmEmail = confirmEmail;
exports.register = register;
exports.refreshAccessToken = refreshAccessToken;
exports.parseCookies = parseCookies;