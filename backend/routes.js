const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const account = require('./db-models/account');

router.get('/testLogin', (req, res, next)=>{
    res.sendFile('./views/testLogin.html', {'root': __dirname});

});

router.post('/testLogin', (req,res)=>{
    console.log("testLogin");
    console.log(req);
    console.log(req.headers);
    console.log(req.body);
    middleware.authenticateToken(req.headers, (result)=>{
        switch(result) {
            case 'Status 401':
                res.status(401).send('blub1');
                break;
            case 'Status 403':
                res.status(403).send('blub2');
            default:
                res.sendFile('/views/testLogin.html', {'root':__dirname});
            }
    })

})

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

router.post('/login', (req,res)=>{
    middleware.login(req.body.email, req.body.password, (result)=>{
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

exports.router = router;