const mongo = require('../../models/db')
const userSchema = require('../../models/user-schema')
const oantutiSchema = require('../../models/oantutilog-schema')
const connectToMongoDB = async (member, cb) => {
    try {
        let oneUser = await userSchema.findOne({ id: member.id, guildId: member.guildId })
        let log = await oantutiSchema.findOne({ id: member.id, guildId: member.guildId })
        await cb(oneUser, log)
    }
    catch (err) {
        console.log(err)
    }
}

const getUser = async function (member) {
    let user = null
    try {
        user = await userSchema.findOne({ id: member.id, guildId: member.guildId }).exec();
        return user;
    }
    catch (err) {
        console.log(err)
    }
}
const playRecently = new Set();

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
        beats: 'scisors'
    },
    {
        name: 'scisors',
        emoji: '✌️',
        beats: 'paper'
    },
    {
        name: 'paper',
        emoji: '✋',
        beats: 'hammer'
    }
];

const emojis = options.map((x) => x.emoji) //['']

const randomSelection = function () {
    return Math.floor(Math.random() * options.length)
}
const selection = function () {
    return options[randomSelection()]
}
module.exports = {
    name: 'oantuti',
    aliases: [],
    category: 'games',
    utilisation: '{prefix}oantuti',
    cooldown: 1,
    async execute(client, message, args) {
        if (playRecently.has(message.author.id)) {
            message.channel.send(`Bạn gõ quá nhanh, vui lòng đợi!`)
            return;
        }
        else {
            var member = {
                id: message.author.id,
                guildId: message.guild.id,
            }
            if (args.length == 0 || args[0] === '0') {
                message.channel.send(`${message.author} phải nhập value để bet`)
                return;
            }
            if (Number.isInteger(parseInt(args[0])) == false && (args[0] != 'all')) {
                message.channel.send(`${message.author} Value nhập không hợp lệ!`)
                return;
            }
            let user = await getUser(member)
            if (user == null) {
                message.channel.send(`Bạn phải tham gia đầu tư mạo hiểm đã`)
                return;
            }
            let balance = user.balance;
            let value = args[0]
            if (value === 'all') value = user.balance;
            else {
                value = parseInt(args[0])
            }
            if (balance == 0 || balance < value) {
                message.channel.send(`${message.author} làm gì có tiền mà đòi bet`)
                return;
            }
            const mess = await message.channel.send({
                embed: {
                    color: '#00ff62',
                    author: { name: message.author.username, icon_url: message.author.displayAvatarURL() },
                    fields: [
                        { name: 'Người chơi', value: message.author },
                        { name: 'Oản tù tì', value: 'React vào emoji để bắt đầu trò chơi!' },
                        { name: 'Emojis', value: `${emojis[0]}: búa, ${emojis[1]}: kéo, ${emojis[2]}: bao` }
                    ],
                    timestamp: new Date()
                }
            }
            )
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

            const collector = mess.createReactionCollector(filter, { max: 1, time: 15000 });

            collector.on('collect', async (reaction, user) => {
                if (user.id == message.author.id) {
                    const userchoice = options.find(option => option.emoji === reaction.emoji.name)
                    const botchoice = selection()
                    if (userchoice.emoji === botchoice.emoji) result = 'draw';
                    if (userchoice.name === botchoice.beats) result = 'botwin';
                    if (userchoice.beats === botchoice.name) result = 'userwin';

                    switch (result) {
                        case 'draw':
                            message.channel.send(`${message.author} Bot ra ${botchoice.emoji} hòa`);
                            break;
                        case 'botwin':
                            balance = balance - value;
                            message.channel.send(`${message.author} Bot ra ${botchoice.emoji} Bot thắng, tài khoản -${value}`);
                            break;
                        case 'userwin':
                            balance = balance + value;
                            message.channel.send(`${message.author} Bot ra ${botchoice.emoji} Bạn thắng ${value}`)
                            break;
                        default:
                            break;
                    }
                }
                connectToMongoDB(member, async (oneUser, log) => {
                    oneUser.balance = parseInt(balance);
                    await oneUser.save();
                    if (log == null) {
                        const newlog = {
                            id: member.id,
                            guildId: member.guildId,
                            amount: value
                        }
                        await new oantutiSchema(newlog).save();
                    }
                    else {
                        log.amount = value;
                        await log.save();
                    }
                })
                collector.on('end', collected => {


                });
            })
            playRecently.add(message.author.id)
            setTimeout(() => {
                playRecently.delete(message.author.id)
            }, (10000));
        }

    },
}