const mongoose = require('mongoose');
const Match = require('./match-schema')
const Ticket = require('./ticket-schema')
const UserSchema = mongoose.Schema({
    id: Number,
    guildId: String,
    balance: Number
})
UserSchema.methods.bet = async function (matchId,choice,value){
    let res;
    let match = await Match.findById(matchId)
    if(match){
        if(match.status == 'completed') res = 'Match is already started'
        else{
            let matchId = match._id
            let rate = (choice=='away')?match.oddAway:match.oddHome
            let ticket = new Ticket({
                match: matchId,
                user:this._id,
                value: value,
                side: choice,
                rate:rate
            })
            await ticket.save()
            match.tickets.push(ticket._id)
            match.total = match.total + value
            if(choice=='away'){
                match.totalAway = match.totalAway + value
            }else{
                match.totalHome = match.totalHome + value
            }
            await match.save()
            this.balance = this.balance - value
            await this.save()
        }
    }
}
module.exports = mongoose.model('users',UserSchema)
