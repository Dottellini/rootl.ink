const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const account = require('./db-models/account');
const fs = require('fs');

//Get

router.get('/testLogin', (req, res)=>{

    let cookies = middleware.parseCookies(req.headers.cookie);
    console.log(cookies)

    middleware.authenticateToken(cookies.accessToken, (resultCode, message)=>{
        switch(resultCode) {
            case 'err':
                res.cookie('accessToken', '');
                res.cookie('refreshToken', '');
                res.send(message);
                break;
            case 'new token':
                res.cookie('accessToken', message, {
                    httpOnly: true
                })
                res.sendFile('/views/testLogin.html', {'root':__dirname});
                break;
            case 'ok':
                res.sendFile('/views/testLogin.html', {'root':__dirname});
                break;
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
    middleware.login(req.body.email, req.body.password, (returnCode, message, refreshToken)=>{
        switch(returnCode){
            case 1:
                res.cookie('accessToken', '', {
                    httpOnly: true,
                });
                res.send(message);
                break;
            case 2:
                res.cookie('accessToken', message, {
                    httpOnly: true,
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                });
                res.send(returnCode.toString());
        }
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