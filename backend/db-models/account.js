const mongoose = require('mongoose');

const AccountObject = new mongoose.Schema({
    password_hash: {
        type:String,
        require: true
    },
    email: {
        type: String,
        required: false
    },
    page_url:{
        type: String,
        require: false
    },
    email_confirmed:{
        type: Boolean,
        required: true
    },
    confirmation_code:{
        type: String,
        required:false
    },
    refresh_token: {
        type: String,
        required: false
    }
});

exports.AccountSchema = mongoose.model('Account', AccountObject);