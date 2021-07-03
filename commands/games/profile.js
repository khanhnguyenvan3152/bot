const mongo = require('../../models/db')
const userSchema = require('../../models/user-schema')
const connectToMongoDB = async(member,cb)=>{
    await mongo().then(async(mongoose)=>{
        try{
            const oneUser = await userSchema.findOne({id:member.id,guildId:member.guildId})
            cb(oneUser)
        }
        finally{
            mongoose.connection.close();
        }
    })
}
module.exports = {
    name: 'profile',
    aliases: [],
    category: 'games',
    utilisation: '{prefix}profile',

    execute(client, message) {
        var member = {
            id: message.author.id,
            guildId: message.guild.id,
        }
        connectToMongoDB(member,function(oneUser)
        {
            if(oneUser!=null)
            {
                message.channel.send({
                    embed: {
                        color: '#0055ff',
                        author: { name: message.author.username, icon_url:message.author.displayAvatarURL() },
                        footer: { text: '' },
                        fields: [
                            { name: 'Balance', value:oneUser.balance}
                        ],
                        timestamp: new Date(),
                    }
                });
            }
            else{
                message.channel.send(`Bạn phải vào nghề đã!`);
            }
        })
        
    },
}