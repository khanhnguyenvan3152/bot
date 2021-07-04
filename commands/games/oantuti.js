const mongo = require('../../models/db')
const userSchema = require('../../models/user-schema')
const oantutiSchema = require('../../models/oantutilog-schema')
const { Emoji } = require('discord.js')
const emoji = new Emoji()
const connectToMongoDB = async(member,cb)=>{
    await mongo().then(async(mongoose)=>{
        try{
            const oneUser = await userSchema.findOne({id:member.id,guildId:member.guildId})
            const log = await oantutilogSchema.findOne({id:member.id,guildId:member.guildId})
            await cb(oneUser,log)
        }
        finally{
            mongoose.connection.close();
        }
    })
}
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " giờ " : " giờ ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " phút " : " phút ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " giây" : " giây") : "";
    return hDisplay + mDisplay + sDisplay; 
}
const options = [
    {
        name: 'búa',
        emoji: ':punch:',
        beats : 'kéo'
    },
    {
        name: 'kéo',
        emoji: ':v:',
        beats: 'bao'
    },
    {
        name:'bao',
        emoji:':wave:',
        beats: 'búa'
    }
];
const randomSelection = function(){ 
    return Math.floor(Math.random()*options.length)
}
const selection = function()
{
    return options[randomSelection()]
}
module.exports = {
    name: 'oantuti',
    aliases: [],
    category: 'games',
    utilisation: '{prefix}oantuti',

    async execute(client, message) {
       var member = {
           id: message.author.id,
           guildId: message.guild.id,
       }
       const mess = await message.channel.send({
           embed :{
                fields:[
                    {name: 'emoji', value: selection().emoji}
                ]
           }
        }
       )
       mess.react('')
    },
}