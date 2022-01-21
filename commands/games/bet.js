const User = require('../../models/user-schema')

module.exports ={
    name: 'bet',
    aliases: [],
    category: 'games',
    utilisation: '{prefix}bet',
    async execute(client,message,args)
    {
        let member = {
            id: message.author.id,
            guildId: message.guild.id
        }
        let user = await User.findOne({id:member.id,guildId:member.guildId})
        let [matchId,side,value] = args.split(' ')
        await user.bet(matchId,side,value)
        
    }
}

