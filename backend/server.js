//Imports
require('dotenv').config();
import express, { json } from 'express';
import { connect } from 'mongoose';
import { PageSchema } from './db-models/page';
import { AccountSchema } from './db-models/account';
import { sign } from 'jsonwebtoken';
import { v4 } from 'uuid';
import { createTransport } from 'nodemailer';
import { renderFile } from 'ejs';

//Setup Email-Sender

var transporter = createTransport({
    service: 'gmail',
    auth: {
      user: 'rootlink.test123@gmail.com',
      pass: '%pFJM,hwr_b,uyv#,F?+66Hb'
    }
  });

// Start Server
const server = express();
server.use(json());
server.set('view engine', 'ejs');
server.use(require("body-parser").json())

//Connect to Database
const dbUri = 'mongodb+srv://Admin:test123@mongodbcluster1.fosb0.mongodb.net/TestDB?retryWrites=true&w=majority'
connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => {
    console.log('Connected to Database')
    server.listen(3000, ()=>{
        console.log('HTTP Server Started');
    })
})
.catch((err)=>console.log(err))

//Routing
server.get('/', (req, res)=>{
    res.sendFile('./views/index.html', {'root': __dirname});
});

server.get('/register', (req, res)=>{
    res.sendFile('./views/register.html', {'root': __dirname});
});

server.post('/register', (req,res)=>{
    const Body = req.body;
    AccountSchema.find({$or:[{email:Body.email},{page_url:Body.page_url}]}, (err, accounts)=>{
        if(!err) {
            if(accounts.length==0) {
                const code = v4();
                const Account = new AccountSchema({
                    account_id: v4(),
                    email: Body.email,
                    page_url: Body.page_url,
                    email_confirmed: false,
                    confirmation_code: code
                });
                renderFile(__dirname+'/email-templates/email-template1.ejs', {code: code, email:Account.email},(err, data)=>{
                    console.log(Body);
                    var mailOptions = {
                        from: 'rootlink.test123@gmail.com',
                        to: Account.email,
                        subject: 'Confirm Your Email Adress - Rootl.ink',
                        text: Body,
                        html: Body
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                })

                Account.save();
                console.log('Account Created');
            } else if(accounts[0].page_url==Body.page_url){
                console.log('Account already exists');
                res.send('URL already exists');
            } else if(accounts[0].email==Body.email){
                console.log('Account already exists');
                res.send('Email already in use');
            }
        }
    });
});

server.get('/confirmEmailCode*', (req,res)=>{
    res.sendFile('./views/confirmEmail.html', {'root': __dirname});
});

server.post('/confirmEmail', (req, res)=>{
    const Body = req.body;
    console.log(Body);
    AccountSchema.find({email:Body.email})
    .then(result=>{
        console.log(result);
        if(result[0].confirmation_code==Body.code) {
            result[0].email_confirmed=true;
            result[0].confirmation_code=undefined;
            console.log('Email Confirmed');
            result[0].save();
            res.send('Confirmed');
        }
    })
});

server.get('/login', (req,res)=>{
    res.sendFile('/views/login.html', {'root':__dirname});
})

server.post('/login', (req,res)=>{
    const Body = req.body;
    AccountSchema.find({email:Body.email})
    .then(result=>{
        if(result.length){
            const payload = {email: result[0].email};
            const accessToken = sign(payload, process.env.ACCESS_TOKEN_SECRET);
            res.json({accessToken: accessToken});
        }
    })
})

server.get('/createPage', (req, res)=>{
     res.sendFile('./views/createPage.html', {'root': __dirname});
});

server.post('/createPage', (req, res)=>{
    const Body = req.body;
    const UserPage = new PageSchema({
        url: Body.url,
        account_id: Body.account_id,
        links: Body.links
    });
    UserPage.save();
});

server.get('/p/*.json', (req,res)=>{
    PageSchema.find({url: req.originalUrl.replace('/p/','').replace('.json','')})
    .then(result=>{
        console.log(result[0]);
        res.send(result[0]);
    })
});

server.get('/p/*', (req, res)=>{
    PageSchema.find({url: req.originalUrl.replace('/p/','')})
    .then(result=>{
        console.log(result);
        if(result.toString()==[]){
            res.sendStatus(404);
        } else{
            res.sendFile('./views/template1.html', {'root': __dirname});
        }
    });
});


function authenticateToken(req,res,next){
    const authHeader = req.headers['authentication']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify (token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err) return res.sendStatus(403)
        req.user = user;
        next()
    })
}