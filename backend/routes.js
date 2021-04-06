const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const account = require('./db-models/account');

//Get

router.get('/testLogin', (req, res)=>{
    let token = null
    try{
        token = req.headers.cookie.replace('login=','')
    }catch{}
    middleware.authenticateToken(token, (result)=>{
        switch(result) {
            case 'Status 401':
                res.status(401).send('No Cookie');
                break;
            case 'Status 403':
                res.cookie('login', result, {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(403).send('Wrong Cookie');
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
    PageSchema.find({url: req.originalUrl.replace('/p/','').replace('.json','')})
    .then(result=>{
        console.log(result[0]);
        res.send(result[0]);
    })
});

router.get('/p/*', (req, res)=>{
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
    middleware.register(req.body.email, req.body.page_url, req.body.password, (result)=>{
        res.send(result);
    })
});

router.post('/createPage', (req, res)=>{
    const Body = req.body;
    const UserPage = new PageSchema({
        url: Body.url,
        account_id: Body.account_id,
        links: Body.links
    });
    UserPage.save();
});

exports.router = router;