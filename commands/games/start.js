const mongo = require('../../models/db')
const userSchema = require('../../models/user-schema')
const connectToMongoDB = async(member,cb)=>{
    await mongo().then(async(mongoose)=>{
        try{
            const oneUser = await userSchema.findOne({id:member.id,guildId:member.guildId})
            await cb(oneUser)
        }
        finally{
            mongoose.connection.close();
        }
    })
}
const checkUser = async (member) =>{
    await mongo().then(async(mongoose)=>{
        try{
            const user = await userSchema.findOne({id:member.id,guildId:member.id})
            if(user == null) return false;
            else return true;
        }
        finally{
            mongoose.connection.close();
        }
    })
}
module.exports = {
    name: 'start',
    aliases: [],
    category: 'games',
    utilisation: '{prefix}start',

    execute(client, message) {
       var member = {
           id: message.author.id,
           guildId: message.guild.id,
       }
       console.log(member)
       connectToMongoDB(member,async function(oneUser){
           if(oneUser == null)
           {
                const user = {
                    id: member.id,
                    guildId: member.guildId,
                    balance:0
                }
                await new userSchema(user).save()
                message.channel.send(`${message.author} Bắt đầu đầu tư mạo hiểm`)
           }
           else
           {
               message.channel.send(`${message.author} đã vào nghề từ trước rồi`)
           }
       })
      
    },
  
};