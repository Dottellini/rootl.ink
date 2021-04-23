router.post('/register', (req,res)=>{
    account.AccountSchema.find({$or:[{email: req.body.email},{username: /^req.body.username.toLowerCase()$/i}]}, (error, accounts)=>{
        if(error){
            res.status(500).json({'result':'ERROR', 'message': 'Cant fetch accounts'});
            return;
        }
        if(accounts.length!=0){
            res.status(403).json({'result':'ERROR', 'message': 'Account already exists'});
            return;
        }
        const confirmationCode = uuid.v4();
        bcrypt.hash(req.body.password, 10, function(error, hash) {
            let Account = new account.AccountSchema({
                password_hash: hash,
                email: req.body.email,
                username: req.body.username,
                email_confirmed: false,
                confirmation_code: confirmationCode
            });

            ejs.renderFile(__dirname+'/email-templates/email-template1.ejs', {code: confirmationCode, email:req.body.email},(error, data)=>{
                var mailOptions = {
                    from: 'rootlink.test123@gmail.com',
                    to: req.body.email,
                    subject: 'Confirm Your Email Adress - Rootl.ink',
                    text: data,
                    html: data
                };
                var emailSender = createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'rootlink.test123@gmail.com',
                      pass: '%pFJM,hwr_b,uyv#,F?+66Hb'
                    }
                  });                
                emailSender.sendMail(mailOptions, function(error, info){
                    if (error) {
                        res.status(500).json({'result':'ERROR', 'message': 'Cant send confirmation email'});
                        return;
                    }
                });
            });
            Account.save();
            res.status(200).json({'result':'OK'});
        })
    });
});
