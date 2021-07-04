const mongo = require('../../models/db')
const userSchema = require('../../models/user-schema')
const anxinlogSchema = require('../..models/anxinlog-schema')
const connectToMongoDB = async(member,cb)=>{
    await mongo().then(async(mongoose)=>{
        try{
            const oneUser = await userSchema.findOne({id:member.id,guildId:member.guildId})
            const log = await anxinlogSchema.findOne({id:member.id,guildId:member.guilId})
            if(log == null)
            {
                const newLog = {
                    id : member.id,
                    guildId: member.guildId,
                }
                await new anxinlogSchema(newLog).save()
            }
            await cb(oneUser,log)
        }
        finally{
            mongoose.connection.close();
        }
    })
}
const checkDate = function(date,logDate)
{

}
const dialog = ['Tào Tháo viện trợ cho bạn ',
                'Bá kiến bố thí cho bạn ',
                'Elon Musk tặng bạn ']
const dialogChoice = ()=>{
    return Math.floor(Math.random()*10/3)
}
const dialogResult = function(choice,addon)
{
    switch (choice){
        case 0: 
            return dialog[choice] + addon + ' quân lương'
        case 1:
            return dialog[choice] + addon + ' xu'
        case 2:
            return dialog[choice] + addon + ' dogecoin'
        default:
            return 'Nhặt được ' + addon + ' đồng'
    }
}
var rate = ()=>{return Math.floor(Math.random() * 100)}
var money = ()=>{return Math.floor(Math.random()*200000)}
module.exports = {
    name: 'anxin',
    aliases: [],
    category: 'games',
    utilisation: '{prefix}anxin',

    execute(client, message) {
        var member = {
            id: message.author.id,
            guildId: message.guild.id,
        }
        connectToMongoDB(member,async function(oneUser,log)
        {
            if(oneUser!=null)
            {
                if(rate()>79)
                {
                    const addon = money();
                    let total = oneUser.balance + addon;
                    oneUser.balance = total;
                    await oneUser.save();
                    let amount = addon;
                    log.amount = addon;
                    await log.save();
                    message.channel.send(`${message.author}` + dialogResult(dialogChoice(),addon))  
                }
                else
                {
                    message.channel.send(`Bạn đéo ăn xin được cái gì cả`)
                }
            }
            else{
                message.channel.send(`Bạn phải vào nghề đã!`);
            }
        })
        
    },
}