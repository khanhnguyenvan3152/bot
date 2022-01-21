const mongoose =require('mongoose')
const {Types} = require('mongoose').Schema
const TeamSchema = new mongoose.Schema({
    name: String,
    alias: String,
    imageURL: String,
})

module.exports = mongoose.model('team',TeamSchema)