const mongo = require('../../models/db')
const userSchema = require('../../models/user-schema')
const connectToMongoDB = async (member, cb) => {
    try {
        const oneUser = await userSchema.findOne({ id: member.id, guildId: member.guildId })
        cb(oneUser)
    }
    catch (err) {
        console.log(err)
    }
}
module.exports = {
    name: 'profile',
    aliases: [],
    category: 'games',
    utilisation: '{prefix}profile',

    execute(client, message, args) {

        let member = {
            id: message.author.id,
            username: message.author.username,
            guildId: message.guild.id,
            avatar: message.author.displayAvatarURL()
        }

        let targetMember = message.mentions.members.first()
        if (targetMember != null) {
            member.id = targetMember.user.id;
            member.username = targetMember.user.username
            member.avatar = targetMember.user.displayAvatarURL()
        }
        connectToMongoDB(member, function (oneUser) {
            if (oneUser != null) {
                message.channel.send({
                    embed: {
                        color: '#0055ff',
                        author: { name: member.username, icon_url: member.avatar },
                        footer: { text: '' },
                        fields: [
                            { name: 'Balance', value: oneUser.balance }
                        ],
                        timestamp: new Date(),
                    }
                });
            }
            else {
                message.channel.send(`Bạn phải vào nghề đã!`);
            }
        })

    },
}