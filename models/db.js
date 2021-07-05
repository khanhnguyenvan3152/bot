require('dotenv').config();
const mongoose = require('mongoose');
const mongoPass = require('../config/bot.js').mongoPass
const uri = `mongodb+srv://discord-admin-1:${mongoPass}@cluster0.mfky7.mongodb.net/padoru?retryWrites=true&w=majority`;

module.exports = async () =>{
    await mongoose.connect(uri,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        serverSelectionTimeoutMS:30000,
    })
    return mongoose
}