const mongoose = require('mongoose')
const Types = mongoose.Schema.Types;
const MatchSchema = new mongoose.Schema({
    homeTeam: {
        type: Types.ObjectId,
        ref: 'team'
    },
    awayTeam:{
        type:Types.ObjectId,
        ref: 'team'
    },
    oddHome : Types.Number,
    oddAway : Types.Number,
    total: {
        type:Types.Number,
        default: 0
    },
    totalHome:  {
        type:Types.Number,
        default: 0
    },
    totalAway:  {
        type:Types.Number,
        default: 0
    },
    tickets: [{
        types:Types.ObjectId,
        ref:'ticket'
    }],
    score:{
        home: {
            type:Types.Number,
            default: 0
        },
        away:{
            type: Types.Number,
            default: 0
        }
    },
    league: String,
    status: {
        type: Types.String,
        default: 'na'
    },
    start: Types.Date,
    winner: {
        type: String,
        default: ''
    }
})

module.exports = mongoose.model('match',MatchSchema)