const mongoose = require('mongoose')
const LenkeoSchema = mongoose.Schema({
    challengerId: Number,
    challengedId: Number,
    guildId: String,
    amount: Number,
    winner:Number
},{timestamps:true})
module.exports = mongoose.model('lenkeologs',LenkeoSchema)