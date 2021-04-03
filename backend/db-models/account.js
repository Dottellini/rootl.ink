const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountObject = new Schema({
    account_id: {
        type: String,
        required: true
    },
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
    }
});

const AccountSchema = mongoose.model('Account', AccountObject);

exports.AccountSchema = AccountSchema;