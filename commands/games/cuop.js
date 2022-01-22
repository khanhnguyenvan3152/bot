const mongo = require('../../models/db')
const userSchema = require('../../models/user-schema')

const connectToMongoDB = async(member1,member2,cb)=>{
    try{
        let firstUser = await userSchema.findOne({id:member1.id,guildId:member1.guildId})
        let secondUser = await userSchema.findOne({id:member2.id,guildId:member2.guildId})
        await cb(firstUser,secondUser);
    
    }catch(err){
        console.log(err)
    }
}

const getUser = async function(member){
    let user = null 
        try{
            user = await userSchema.findOne({id:member.id,guildId:member.guildId}).exec();
            return user;
        }
        catch(err){
            mongoose.connection.close();
        }
}
const percent = function(targetLog)
{
    var rate;
    switch (true)
        {
            case targetLog.balance > 10000000:
                rate = 22;
                break;
            case targetLog.balance > 1000000:
                rate = 17;
                break;
            case targetLog.balance > 100000:
                rate = 15;
                break;
            default:
                rate =25;
                break;
    }
    return rate/100;
}
const random = function(){
    return Math.random();
}
module.exports = {
    name: 'cuop',
    alias: [],
    category: 'games',
    utilisation: '{prefix}cuop',
    cooldown: 1,
    async execute(client,message)
    {
        var member ={
            id:message.author.id,
            guildId:message.guild.id
        }
        const mentioned = message.mentions.members.first();
        const target = {
            id: mentioned.user.id,
            guildId: message.guild.id
        }
        const memberLog = await getUser(member);
        const targetLog = await getUser(target);
        if(memberLog == undefined || targetLog == undefined)
        {
            message.channel.send(`${message.author} hoặc ${target} chưa tham gia đầu tư`)
            return;
        }
        if(targetLog.balance == 0)
        {
            message.channel.send(`${mentioned.user} không có tiền để cướp`)
            return;
        }
        var rannum = random();
        var rate = percent(targetLog);
        console.log(rannum + " " + rate)
        if(rannum<rate)
        {
            var value = Math.round((rannum *targetLog.balance)/(1.8));
            var memberNewBalance = memberLog.balance + value;
            var targetNewBalance = targetLog.balance - value;
            await connectToMongoDB(member,target,async function(firstUser,secondUser){
                firstUser.balance = memberNewBalance;
                await firstUser.save();
                secondUser.balance = targetNewBalance;
                await secondUser.save();
                message.channel.send(`${message.author} đi ăn cắp đã vô tình nhặt được ${value} từ  ${mentioned.user}`)
            })
        }
        else if(rannum < (1-rate-0.4))
        {
            message.channel.send(`Bạn không cướp được cái gì cả`);
        }
        else{
            if(memberLog.balance > 0)
            {
                var value =  Math.round(memberLog.balance*(0.09));
                var memberNewBalance = memberLog.balance - value;
                await connectToMongoDB(member,target,async function(firstUser,secondUser){
                    firstUser.balance = memberNewBalance;
                    await firstUser.save();
                    message.channel.send(`${message.author} đi ăn cắp bị cảnh sát bắt được phạt ${value}`)
                })
            }
            else{
                message.channel.send(`Bạn không cướp được cái gì cả`);
            }
        }
    }
}