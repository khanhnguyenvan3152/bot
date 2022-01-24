const User = require('../../models/user-schema')
module.exports = {
    name: 'baucua',
    aliases: [],
    category: 'games',
    utilisation: '{prefix}baucua',
    cooldown: 1,
    async execute(client, message, args) {
        let user = {
            id: message.author.id,
            guildId: message.guild.id
        }
        if (args.length == 0) {
            message.channel.send(`${message.author} chưa nhập giá trị vé cược!`)
        } else {
            let userInfo = await User.findOne({ id: user.id, guildId: user.guildId })
            if (!userInfo) {
                message.channel.send(`${message.author} chưa tham gia đầu tư mạo hiểm`)
                return;
            } else {
                const embed = {
                    color: '#00ff62',
                    author: { name: message.author.username, icon_url: message.author.displayAvatarURL() },
                    fields: [
                        { name: 'Người chơi', value: message.author },
                        { name: 'Bầu cua', value: 'React vào emoji để bắt đầu trò chơi!' },
                        { name: 'Emojis', value: `${emojis[0]}: bầu, ${emojis[1]}: cua, ${emojis[2]}: tôm` },
                        { name: '\u200b', value: `${emojis[3]}: cá, ${emojis[4]}: nai, ${emojis[5]}: gà` }
                    ],
                    timestamp: new Date()
                }
                
                const mess = await message.channel.send({ embed })
                try {
                    options.forEach(async (option) => {
                        await mess.react(option.emoji)
                    })
                } catch (err) {
                    console.log(err)
                }
                let userSelections = []
                let dices;
                let baseValue = Number.parseInt(args[0])
                let userValue = 0;
                const filter = (reaction, user) => {
                    return emojis.includes(reaction.emoji.name) && user.id === message.author.id;
                };

                const collector = mess.createReactionCollector(filter, { max: 3, time: 15000 });
                collector.on('collect', function (reaction, user) {
                    userSelections.push(reaction.emoji.name)
                })
                collector.on('end',async function(){
                    userValue = -(baseValue * userSelections.length)
                    dices = bot()
               
                    dices.forEach(dice =>{
                        userSelections.forEach(selection =>{
                            if(dice.emoji == selection) userValue+= baseValue
                        })
                    })
                    if(userValue<0){
                        userInfo.balance= userInfo.balance - baseValue*userSelections.length;
                    }else{
                        userInfo.balance = userInfo.balance + userValue;
                    }
                    await userInfo.save()
                    let result;
                    if(userValue < 0){
                        result = `${message.author} thua ${Math.abs(userValue)}`
                    }else{
                        result = `${message.author} thắng ${userValue}`
                    }
                    message.channel.send(`Bot ra ${resultEmojis(dices)}. ${result}`)
                })
            }
        }
    }
}

const options = [
    {
        name: "peanuts",
        emoji: "🥜",
        alias: "bầu"
    },
    {
        name: "crab",
        emoji: "🦀",
        alias: "cua"
    },
    {
        name: "shrimp",
        emoji: "🦐",
        alias: "tôm"
    },
    {
        name: "fish",
        emoji: "🐟",
        alias: "cá"
    },
    {
        name: "deer",
        emoji: "🦌",
        alias: "nai"
    },
    {
        name: "turkey",
        emoji: "🦃",
        alias: "gà"
    }
]

const emojis = options.map(x => x.emoji)

function getRandomNumber() {
    return Math.floor(Math.random() * 6)
}

function bot(){
    let first = options[getRandomNumber()]
    let second = options[getRandomNumber()]
    let third = options[getRandomNumber()]
    return [first,second,third]
}

const resultEmojis = (arr)=>{
    let emojis = arr.map(x=> x.emoji)
    return emojis.join(' ');
}