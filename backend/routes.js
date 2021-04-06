const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const account = require('./db-models/account');
const fs = require('fs');

//Get

router.get('/testLogin', (req, res)=>{
    let token = null
    try{
        token = req.headers.cookie.replace('login=','')
    }catch{}
    middleware.authenticateToken(token, (result)=>{
        switch(result) {
            case 'Status 401':
                res.status(401).send('Not Logged in');
                break;
            case 'Status 403':
                res.cookie('login', result, {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(403).send('Wrong Login');
                break;
            default:
                res.sendFile('/views/testLogin.html', {'root':__dirname});
        }
    })
});

router.get('/', (req, res)=>{
    res.sendFile('./views/index.html', {'root': __dirname});
});

router.get('/register', (req, res)=>{
    res.sendFile('./views/register.html', {'root': __dirname});
});

router.get('/confirmEmailCode*', (req,res)=>{
    res.sendFile('./views/confirmEmail.html', {'root': __dirname});
});

router.get('/createPage', (req, res)=>{
    res.sendFile('./views/createPage.html', {'root': __dirname});
});

router.get('/login', (req,res)=>{
    res.sendFile('/views/login.html', {'root':__dirname});
});

router.get('/p/*.json', (req,res)=>{
    res.sendFile(req.url.replace('/p/','/userpages/').replace('.json','.txt'), {'root':__dirname});
});

router.get('/p/*', (req, res)=>{
    res.sendFile('/views/template1.html', {'root':__dirname});
});

//Post

router.post('/login', (req,res)=>{
    middleware.login(req.body.email, req.body.password, (result)=>{
        res.cookie('login', result, {
            httpOnly: true,
        });
        res.send(result);
    })
});

router.post('/confirmEmail', (req, res)=>{
    middleware.confirmEmail(req.body.email, req.body.code, (result)=>{
        res.send(result);
    });
});

router.post('/register', (req,res)=>{
    middleware.register(req.body.email, req.body.password, (result)=>{
        res.send(result);
    })
});

router.post('/createPage', (req, res)=>{
    fs.writeFile('./userpages/'+req.body.url+'.txt', req.body.siteData, function (err) {
        if (err) throw err;
      });
});

exports.router = router;