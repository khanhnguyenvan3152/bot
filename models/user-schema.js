const mongoose = require('mongoose');
const Match = require('../models/match-schema')
const Ticket = require('../models/ticket-schema')
const UserSchema = mongoose.Schema({
    id: Number,
    guildId: String,
    balance: Number
})

UserSchema.methods.bet = async function (match,choice,value){
    let res;
    let match = await Match.findById(match)
    if(match){
        if(match.status == 'completed' || match.status == 'ongoing') res = 'Match is already started'
        else{
            let matchId = match._id
            let rate = (side=='away')?match.oddAway:match.oddHome
            let ticket = new Ticket({
                match: matchId,
                user:this._id,
                value: value,
                side: choice,
                rate:rate
            })
            await ticket.save()
            this.balance = this.balance - value
            await this.save()
        }
    }
}
module.exports = mongoose.model('users',UserSchema)
