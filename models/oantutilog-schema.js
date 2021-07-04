const mongoose = require('mongoose')
const OantutiSchema = mongoose.Schema({
    id : Number,
    guildId: String,
    winner:String,
    amount: Number
},{timestamps:true})
module.exports = mongoose.model('oantutilog',OantutiSchema)