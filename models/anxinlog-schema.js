
const mongoose = require('mongoose')
const AnxinLogSchemna = mongoose.Schema({
    id : Number,
    guildId: String,
    amount: Number,   
},{timestamp : true})
module.exports = mongoose.model('anxinlog',AnxinLogSchemna)