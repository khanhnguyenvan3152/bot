const mongo = require('../../models/db')
const userSchema = require('../../models/user-schema')
const anxinlogSchema = require('../../models/anxinlog-schema')
const connectToMongoDB = async(member,cb)=>{
    await mongo().then(async(mongoose)=>{
        try{
            const oneUser = await userSchema.findOne({id:member.id,guildId:member.guildId})
            const log = await anxinlogSchema.findOne({id:member.id,guildId:member.guildId})
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
var rate = ()=>{return Math.floor(Math.random() * 100)}
var money = ()=>{return Math.floor(Math.random()*200000)}
module.exports = {
    name: 'anxin',
    aliases: [],
    category: 'games',
    utilisation: '{prefix}anxin',
    cooldown: 1,
    execute(client, message) {
        var member = {
            id: message.author.id,
            guildId: message.guild.id,
        }
        const date = new Date()
        connectToMongoDB(member,async function(oneUser,log)
        {
            if(log!=null)
            {
                const logDate = new Date(log.updatedAt)
                const secondDiff = (date.getTime() - logDate.getTime())/1000;
                if(secondDiff<600)
                {
                    const result = secondsToHms(600-secondDiff)
                    message.channel.send(`${message.author} Mày phải đợi ${result}`)
                    return;
                }
            }
            if(oneUser!=null)
            {
                if(rate()>10)
                {
                    const addon = money();
                    let total = oneUser.balance + addon;
                    oneUser.balance = total;
                    await oneUser.save();
                    if(log !=null)
                    {
                        log.amount = addon;
                        await log.save();
                    }
                    else
                    {
                        const newlog ={
                            id:member.id,
                            guildId: member.guildId,
                            amount:addon
                        }
                        await new anxinlogSchema(newlog).save()
                    }
                    message.channel.send(`${message.author}` + dialogResult(dialogChoice(),addon))  
                }
                else
                {
                    if(log !=null)
                    {
                        log.amount = 0;
                        await log.save();
                    }
                    else
                    {
                        const newlog ={
                            id:member.id,
                            guildId: member.guildId,
                            amount:0
                        }
                        await new anxinlogSchema(newlog).save()
                    }
                    message.channel.send(`Bạn đéo ăn xin được cái gì cả`)
                }
            }
            else{
                message.channel.send(`Bạn phải vào nghề đã!`);
            }
        })
        
    },
}