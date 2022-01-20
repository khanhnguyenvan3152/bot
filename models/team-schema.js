const mongoose =require('mongoose')
const {Types} = mongoose
const TeamSchema = new mongoose.Schema({
    name: String,
    alias: String,
    imageURL: String,
})


module.exports = mongoose.model('team',TeamSchema)