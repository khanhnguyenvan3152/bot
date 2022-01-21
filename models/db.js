require('dotenv').config();
const mongoose = require('mongoose');

const uri = `mongodb+srv://discord-admin-1:${process.env.DBPASSWORD}@cluster0.mfky7.mongodb.net/padoru?retryWrites=true&w=majority`;
const connect = function(){
    mongoose.connect(uri,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>{
        console.log('connected')
    })
}

module.exports = {connect}