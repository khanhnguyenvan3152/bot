const mongo = require('../../models/db')
const userSchema = require('../../models/user-schema')
const oantutiSchema = require('../../models/oantutilog-schema')
const connectToMongoDB = async(member1,member2,cb)=>{
    await mongo().then(async(mongoose)=>{
        try{
            let sender = await userSchema.findOne({id:member1.id,guildId:member1.guildId})
            let receiver = await userSchema.findOne({id:member2.id,guildId:member2.guildId})
            await cb(sender,receiver)
        }
        finally{
            mongoose.connection.close();
        }
    })
}

const getUser = async function(member){
    let user = null 
    await mongo().then(async(mongoose)=>{
        try{
            user = await userSchema.findOne({id:member.id,guildId:member.guildId}).exec();
        }
        finally{
            mongoose.connection.close();
        }
    })
    return user;
}

module.exports = {
    name: 'give',
    aliases: [],
    category: 'games',
    utilisation: '{prefix}give',
    async execute(client, message,args) {
        const member1 = {
            id: message.author.id,
            guildId: message.guild.id
        }
        let giver = await getUser(member1)
        let targetMember = message.mentions.members.first();
        const member2 = {
            id: targetMember.user.id,
            guildId: message.guild.id
        }
        let taker = await getUser(member2)
        if(args.size == 0)
        {
            message.channel.send(`Nhập người để cho`)
            return;
        }
        
        let value = parseInt(args[1])
        if (args[1] === 'all') value = giver.balance;
        if((value == 0) || (Number.isInteger(value)==false))
        {
            message.channel.send(`Nhập value hợp lệ`)
            return;
        }
        if(value > giver.balance)
        {
            message.channel.send(`${message.author} Không đủ tiền để cho`)
            return
        }
        giver.balance = giver.balance - value;
        taker.balance = taker.balance + value;
        connectToMongoDB(member1,member2,async function(sender,receiver){
            sender.balance = giver.balance;
            receiver.balance = taker.balance;
            await sender.save();
            await receiver.save();
            message.channel.send(`${message.author} bố thí cho ${targetMember.user} ${value}`)
            return;
        })

    }
}