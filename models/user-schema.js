const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    id: Number,
    guildId: String,
    balance: Number
})
module.exports = mongoose.model('users',UserSchema)
