const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PageObject = new Schema({
    url: {
        type: String,
        required: true,
    },
    account_id: {
        type: String,
        required: false
    },
    links:{
        type: [Object],
        require: false
    }
});

const PageSchema = mongoose.model('Page', PageObject);

exports.PageSchema = PageSchema;