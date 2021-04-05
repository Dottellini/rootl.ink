const account = require('./db-models/account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function authenticateToken(req,res,next){
    const authHeader = req.headers['authentication'];
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify (token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err) return res.sendStatus(403)
        req.user = user;
        next();
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
    account.AccountSchema.find({email:emailAddress}).then(result=>{
        if(!result.length){
            callback('Account not Found');
            return;
        }
        bcrypt.compare(password, result[0].password_hash, function(err, PasswordResult) {
            if(!PasswordResult) {
                callback('Password Wrong');
                return;
            }
            const payload = {email: emailAddress};
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
            callback(JSON.stringify({accessToken: accessToken}));
            return;
        });
    })
};

function register(emailAddress, pageUrl, password, callback) {
    account.AccountSchema.find({$or:[{email:emailAddress},{page_url:pageUrl}]}, (error, accounts)=>{
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
                account_id: uuid.v4(),
                password_hash: hash,
                email: emailAddress,
                page_url: pageUrl,
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

exports.login = login;
exports.authenticateToken = authenticateToken;
exports.confirmEmail = confirmEmail;
exports.register = register;