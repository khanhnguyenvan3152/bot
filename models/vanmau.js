const mongoose = require('mongoose');

const vanmau = new mongoose.Schema({
    content: String
},{timestamps:true});

module.exports = mongoose.model('vanmau',vanmau);