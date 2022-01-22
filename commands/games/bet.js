const User = require('../../models/user-schema')
const Match =require('../../models/match-schema')
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
        let [matchId,side,value] = args
        side = side.toLowerCase()
        let betValue = parseFloat(value)
        if(betValue > user.balance){
            message.channel.send(`Bạn không đủ tiền để bet`)
            return;
        }
        await user.bet(matchId,side,betValue)
        message.channel.send(`Bạn đã bet trận ${matchId} với ${value} vào ${side}`)
    }
}

