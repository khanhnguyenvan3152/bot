const {MongoClient} = require('mongodb')
const User = require('../../models/user-schema')

let activated = false;
module.exports = {
    name : 'taixiu',
    aliases: [],
    category : 'games',
    utilisation: '',
    async execute(client,message,args){
        const number = rand();
        if(activated == false)
        {
            activated = true;
            let totalValue = 0;
            let valueXiu = 0;
            let valueTai = 0;
            let rateTai = 0;
            let rateXiu = 0;
            message.channel.send(`Mở xới, cú pháp : ![tai/xiu] [value]`)
            activated = true;
            let players = [];
            const filter = (message) => {
                return message.content.startsWith('!tai') || message.content.startsWith('!xiu');
            }
            try{
                const users = await User.find({})
                const collector = message.channel.createMessageCollector(filter,{time:60000})  
                collector.on('collect', async (m)=>{
                    const mess = m.content.trim();
                    const option = mess.slice(1,4);
                    const value = parseInt(mess.slice(5,mess.length))
                    let player = {
                        id: m.author.id,
                        guildId: m.guild.id,
                        value: value,
                        side: option,
                        balance:0
                    }
                    console.log(player);
                    let playerProfile = await User.findOne({id:player.id,guildId:player.guildId},function(result){
                        return result;
                    })
                    console.log(playerProfile)
                    if(playerProfile == null)
                    {
                        m.channel.send(`${m.author} chưa tham gia trò chơi mạo hiểm`)
                    }
                    else
                    {
                        player.balance = playerProfile.balance;
                        if(value > playerProfile.balance)
                        {
                            m.channel.send(`${m.author} không đủ tiền để đặt`)
                        }
                        else
                        {
                            if(players.find(p=>p.id==player.id))
                            {
                                let tmp = players[players.findIndex(p=>p.id==player.id)];
                                if(tmp.option != player.option)
                                {
                                    m.channel.send(`${m.author} Không thể đặt 2 cửa`)
                                }
                                else
                                {
                                    players[players.findIndex(p=>p.id==player.id)].value+=value;
                                    player.balance = player.balance - value;
                                    totalValue+=value;
                                    (option==='tai')?(valueTai+=value):(valueXiu+=value)
                                    rateTai = valueTai/valueXiu;

                                    if (rateTai == Infinity) {rateTai = 0;}
                                    else{
                                        rateTai = Number(rateTai).toFixed(2)
                                    }
                                    rateXiu = 1/rateTai;
                                    if(rateXiu == Infinity) {rateXiu = 0}
                                    else{
                                        rateXiu = Number(rateXiu).toFixed(2);
                                    }
                                    m.channel.send(`${m.author} Đặt thêm ${value} vào cửa ${option}. Tổng ${players[players.findIndex(p=>p.id==player.id)].value}`)
                                    await m.channel.send({
                                        embed:
                                        {
                                            color: 0x0099ff,
                                            title: 'Tài xỉu',
                                            author: {
                                                name: client.name,
                                                // icon_url: 'https://i.imgur.com/AfFp7pu.png',
                                                // url: 'https://discord.js.org',
                                            },
                                            description: '',
                                            thumbnail: {
                                                url: 'https://789bet.org/wp-content/uploads/2020/09/choi-tai-xiu-online-1.jpg',
                                            },
                                            fields: [
            
                                                {
                                                    name: '\u200b',
                                                    value: '\u200b',
                                                    inline: false,
                                                },
                                                {
                                                    name: 'Tài',
                                                    value: valueTai,
                                                    inline: true,
                                                },
                                                {
                                                    name: 'Xỉu',
                                                    value: valueXiu,
                                                    inline: true,
                                                },
                                                {
                                                    name: 'Tài - Xỉu',
                                                    value: rateTai + ' - ' + rateXiu,
                                                },
                                            ],
                                            // image: {
                                            //     url: 'https://i.imgur.com/AfFp7pu.png',
                                            // },
                                            timestamp: new Date(),
                                            footer: {
                                                text: 'Chúc bet thủ may mắn',
                                            },
                                        }
                                    })
                                    updateBalance(User,player)
                                }
                            }
                            else{
                                player.balance = player.balance - value;
                                player.value = player.value + value;
                                players.push(player);
                                totalValue+=value;
                                if(option==='tai') valueTai+=value;
                                else valueXiu+=value;
                                rateTai = valueTai/valueXiu;
                                if (rateTai == Infinity) rateTai = 0;
                                rateXiu = 1/rateTai;
                                if(rateXiu == Infinity) rateXiu = 0;
                                m.channel.send(`${m.author} đặt ${value} vào ${option}`)
                                await m.channel.send({
                                    embed:{ 
                                        color: 0x0099ff,
                                        title: 'Tài xỉu',
                                        author: {
                                            name: client.name,
                                            // icon_url: 'https://i.imgur.com/AfFp7pu.png',
                                            // url: 'https://discord.js.org',
                                        },
                                        description: '',
                                        thumbnail: {
                                            url: 'https://789bet.org/wp-content/uploads/2020/09/choi-tai-xiu-online-1.jpg',
                                        },
                                        fields: [
                                            {
                                                name: '\u200b',
                                                value: '\u200b',
                                                inline: false,
                                            },
                                            {
                                                name: 'Tài',
                                                value: valueTai,
                                                inline: true,
                                            },
                                            {
                                                name: 'Xỉu',
                                                value: valueXiu,
                                                inline: true,
                                            },
                                            {
                                                name: 'Tài - Xỉu',
                                                value: rateTai + ' - ' +rateXiu,
                                            },
                                        ],
                                        // image: {
                                        //     url: 'https://i.imgur.com/AfFp7pu.png',
                                        // },
                                        timestamp: new Date(),
                                        footer: {
                                            text: 'Chúc bet thủ may mắn',
                                        },
                                    }
                                })
                            }
                            updateBalance(User,player);
                        }
                    
                    }
                })
                
                await collector.on('end', async (collected)=>{
                    console.log(collected.size);
                    const result = rollResult();
                    players.forEach((player) =>{
                        if(player.option === result.winner)
                        {
                            player.balance = player.balance + player.value*(1+rate)
                        }
                    })
                    await updatePlayers(User,players);
                    message.channel.send(`${result.winner} thắng`)
                    activated = false;
                })
            
                
            }
            catch(e)
            {
                console.log(e);
            }
        }
        else{
            message.channel.send(`Đang có kèo mà`)
            return;
        }
    }
}

const getUser = async function(collection,member){
    let user = await collection.findOne({id:""+member.id,guildId:""+member.guildId});
    return user;
}

const updateBalance = async function(collection,member)
{
    await collection.updateOne({id:""+member.id,guildId:""+member.guildId},{$set:{balance:member.balance}})
}
const updatePlayers = async function(collection,players){
    await players.forEach( async (player) => {
         await updateBalance(collection,player) 
    })
}

const randomNumber = function()
{
    return Math.floor(Math.random()*6)+1
}
const rolledDice =function(){
    return dice[randomNumber()-1]
}
function rollResult(){
    const dice1 = rolledDice();
    const dice2 = rolledDice();
    const dice3 = rolledDice();
    const value = dice1.number + dice2.number+dice3.number;
    const emojis = dice1.emoji + " " + dice2.emoji + " " + dice3.emoji;
    const winner = (value>=9)?'tai':'xiu';
    const result = {value:value,emojis:emojis,winner:winner}
    return result;
}
const dice  = [
    {
        number:1,
        emoji: '1️⃣'
    },
    {
        number:2,
        emoji:'2️⃣'
    },
    {
        number:3,
        emoji:'3️⃣'
    },
    {
        number:4,
        emoji: '4️⃣'
    },
    {
        number:5,
        emoji:'5️⃣'
    },
    {
        number:6,
        emoji:'6️⃣'
    }
]

const rand = ()=>{
    return Math.random()
}




