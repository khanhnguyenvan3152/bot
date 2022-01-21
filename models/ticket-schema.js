const mongoose = require('mongoose')
const {Types} = require('mongoose').Schema

const TicketSchema = new mongoose.Schema({
    user: {
        type: Types.ObjectId,
        ref: 'user'
    },
    match:{
        type: Types.ObjectId,
        ref: 'match'
    },
    side: String,
    value:{
        type: Types.Number, 
        default: 0
    },
    rate: Types.Number,
})

TicketSchema.virtual('return').get(function(){
    return this.value*this.rate
})

module.exports = mongoose.model('ticket',TicketSchema)