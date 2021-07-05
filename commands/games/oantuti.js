const mongo = require('../../models/db')
const userSchema = require('../../models/user-schema')
const oantutiSchema = require('../../models/oantutilog-schema')
const { Emoji } = require('discord.js')
const anxinlogSchema = require('../../models/anxinlog-schema')
const connectToMongoDB = async(member,cb)=>{
    await mongo().then(async(mongoose)=>{
        try{
            const oneUser = await userSchema.findOne({id:member.id,guildId:member.guildId})
            const log = await oantutiSchema.findOne({id:member.id,guildId:member.guildId})
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
        name: 'hammer',
        emoji: '👊',
        beats : 'scisors'
    },
    {
        name: 'scisors',
        emoji: '✌️',
        beats: 'paper'
    },
    {
        name:'paper',
        emoji:'✋',
        beats: 'hammer'
    }
];

const emojis = options.map((x)=>x.emoji) //['']

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
    cooldown:1,
    async execute(client, message,args) {
       var member = {
           id: message.author.id,
           guildId: message.guild.id,
       }
       var value = args[0]
       if(args.length ==0 || args[0] === '0')
       {
           message.channel.send(`${message.author} phải nhập value để bet`)
           return;
       }
       const mess = await message.channel.send({
           embed :{
                color:'#00ff62',
                author: { name: message.author.username, icon_url:message.author.displayAvatarURL() },
                fields:[
                    {name:'Người chơi', value: message.author},
                    {name: 'Oản tù tì', value: 'React vào emoji để bắt đầu trò chơi!'},
                    {name:'Emojis', value: `${emojis[0]}: búa, ${emojis[1]}: kéo, ${emojis[2]}: bao`}
                ],
                timestamp: new Date()
           }
        }
       )
       console.log(emojis)
       try {
            await mess.react(emojis[0])
            await mess.react(emojis[1])
            await mess.react(emojis[2])
        } catch (error) {
            console.error('One of the emojis failed to react:', error);
        }

       const filter = (reaction, user) => {
        return emojis.includes(reaction.emoji.name) && user.id === message.author.id;
        };
        
        const collector = mess.createReactionCollector(filter, {max:1, time: 15000 });

        collector.on('collect', (reaction, user) => {
            if(user.id == message.author.id)
            {
                
                const userchoice = options.find(option => option.emoji === reaction.emoji.name)
                const botchoice = selection()
                if(userchoice.emoji === botchoice.emoji) result = 'draw';
                if(userchoice.name === botchoice.beats) result = 'botwin';
                if(userchoice.beats === botchoice.name) result = 'userwin';
                console.log(result)
                connectToMongoDB(member,async function(oneUser,log){
                    if(oneUser == null)
                    {
                        message.channel.send(`Bạn phải tham gia đầu tư mạo hiểm đã`)
                        return;
                    }
                   switch (result){
                       case 'draw':
                           message.channel.send(`${message.author} hòa`);
                           break;
                        case 'botwin':
                            if(value === 'all') value = oneUser.balance 
                            message.channel.send(`${message.author} Bot thắng, tài khoản -${value}`);
                            if(log == null)
                            {
                                const newlog = {
                                    id: member.id,
                                    guildId: member.guildId,
                                    amount: value
                                }
                                await new anxinlogSchema(newlog).save();
                            }
                            else
                            {
                                log.amount = value;
                                await log.save();
                            }
                            oneUser.balance = oneUser.balance - value;
                            await oneUser.save();
                            break;
                        case 'userwin':
                            if(value === 'all') value = oneUser.balance 
                            message.channel.send(`${message.author} Bạn thắng ${value}`)
                            if(log == null)
                            {
                                const newlog = {
                                    id: member.id,
                                    guildId: member.guildId,
                                    amount: value
                                }
                                await new anxinlogSchema(newlog).save();
                            }
                            else
                            {
                                log.amount = value;
                                await log.save();
                            }
                            oneUser.balance = oneUser.balance + value;
                            await oneUser.save()
                            break;
                        default:
                            break;
                   }
                })
                return;
            }
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        });
        // mess.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
        //     .then(collected => {
        //         if(collected == null)
        //         {
        //             message.channel.send(`${message.author} rén à mà đéo dám bet`)
        //             return;
        //         }
        //         var result;
        //         const reaction = collected.first()
        //         const userchoice = options.find(x=>x.emoji == reaction.emoji.name).first()
        //         console.log(reaction)
        //         const botchoice = selection()
        //         if(userchoice.emoji == botchoice.emoji) result = 'draw';
        //         if(userchoice.emoji == botchoice.beats) result = 'botwin';
        //         if(userchoice.beats == botchoice.emoji) result = 'userwin';
        //         connectToMongoDB(member,async function(oneUser,log){
        //             if(oneUser == null)
        //             {
        //                 message.channel.send(`Bạn phải tham gia đầu tư mạo hiểm đã`)
        //                 return;
        //             }
        //            switch (result){
        //                case 'draw':
        //                    message.channel.send(`${message.author} hòa`);
        //                    break;
        //                 case 'botwin':
        //                     message.channel.send(`${message.author} Bot thắng, tài khoản -${value}`);
        //                     if(log == null)
        //                     {
        //                         const newlog = {
        //                             id: member.id,
        //                             guildId: member.guildId,
        //                             amount: value
        //                         }
        //                         await new anxinlogSchema(newlog).save();
        //                     }
        //                     else
        //                     {
        //                         log.amount = value;
        //                         await log.save();
        //                     }
        //                     oneUser.balance = onseUser.balance - value;
        //                     await oneUser.save();
        //                     break;
        //                 case 'userwin':
        //                     message.channel.send(`${message.author} Bạn thắng ${value}`)
        //                     if(log == null)
        //                     {
        //                         const newlog = {
        //                             id: member.id,
        //                             guildId: member.guildId,
        //                             amount: value
        //                         }
        //                         await new anxinlogSchema(newlog).save();
        //                     }
        //                     else
        //                     {
        //                         log.amount = value;
        //                         await log.save();
        //                     }
        //                     oneUser.balance = onsUser.balance + value;
        //                     await oneUser.save()
        //                     break;
        //                 default:
        //                     break;
        //            }
        //         })
                             
        //     })
        //     .catch(collected => {
        //         console.log(`After a minute, only ${collected.length} out of 4 reacted.`);
        //     });
    },
}