const mongoose = require('mongoose')
const AnxinLogSchema = mongoose.Schema({
    id : Number,
    guildId: String,
    amount: Number,   
},
{
    timestamps : true
}
)
module.exports = mongoose.model('anxinlog',AnxinLogSchema)