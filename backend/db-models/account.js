const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountObject = new Schema({
    account_id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false
    },
    page_url:{
        type: String,
        require: false
    }
});

const AccountSchema = mongoose.model('User', AccountObject);

exports.AccountSchema = AccountSchema;