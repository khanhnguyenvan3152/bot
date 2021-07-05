const mongo = require('../../models/db')
const userSchema = require('../../models/user-schema')
const LenkeoSchema = require('../../models/lenkeolog-schema')

const connectToMongoDB = async (challenger,challenged,cb)=>{
    await mongo().then(async (mongoose)=>{
        try{
            const user1 = await userSchema.findOne({id:challenger.id,guildId:challenger.guildId})
            const user2 = await userSchema.findOne({id:challenger.id,guildId:challenger.guildId})
            const log = await lenkeoSchema.findOne({challengerId:challenger.id,challengedId:challenged.id,guildId:challenged.id})
            cb(user1,user2,log)
        }
        finally{
            mongoose.connection.close();
        }
    })
}
module.exports = {
    name: 'lenkeo',
    aliases: [],
    category: 'games',
    utilisation: '{prefix}lenkeo',

    execute(client, message,args) {
       var member1 = {
           id: message.author.id,
           guildId: message.guild.id,
       }
       var idChallenged = args[0].replace(/[\\<>@#&!]/g,"")
       var member2 ={
           id: args[0],
           guildId: message.guild.id
       }
       const prefix = client.config.discord.prefix;

       console.log(member1.id)
       console.log(idChallenged)
       message.channel.send(`${member2.id}`)
    },
}