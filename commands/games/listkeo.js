const Match = require('../../models/match-schema')
const Team = require('../../models/team-schema')
const { MessageEmbed, MessageAttachment } = require('discord.js')
const ImageHelper = require('../../helpers/imageHelper')
module.exports = {
    name: 'listkeo',
    aliases: [],
    category: 'games',
    utilisation: '{prefix}listkeo',
    async execute(client, message, args) {
        let embedList = []
        let list = await Match.find({}).where('status').in(['ongoing', 'na']).populate('homeTeam').populate('awayTeam')
        if (list.length != 0) {

            list.forEach(async (match) => {

                let homeTeam = match.homeTeam
                let awayTeam = match.awayTeam
                ImageHelper.getMergeImage(homeTeam, awayTeam, function () {
                    const file= new MessageAttachment(`images/${homeTeam.alias}${awayTeam.alias}.png`, `${homeTeam.alias}${awayTeam.alias}.png`)
                    const embed = {
                        color: 0x0099ff,
                        title: '!listbet',
                        author: {
                            name: 'Bot'
                        },
                        description: 'Một số kèo ngày hôm nay',
                        fields: [
                            {
                                name: 'Match id',
                                value: `${match._id}`
                            },
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: false,
                            },
                            {
                                name: 'Home',
                                value: `${homeTeam.name}`,
                                inline: true
                            },
                            {
                                name: 'Away',
                                value: `${awayTeam.name}`,
                                inline: true
                            },
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: false,
                            },
                            {
                                name: 'Rate Home',
                                value: `${match.oddHome}`,
                                inline: true
                            },
                            {
                                name: 'Rate Away',
                                value: `${match.oddAway}`,
                                inline: true
                            },
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: false,
                            },
                            {
                                name: 'Tổng cược',
                                value: `${match.total}`,
                                inline: true,
                            },
                            {
                                name: 'Bắt đầu',
                                value: `${new Date(match.start)}`,
                            },
                        ],
                        image: {
                            url: `attachment://${homeTeam.alias}${awayTeam.alias}.png`,
                        },
                        timestamp: new Date(),
                    };
                    const exampleEmbed = new MessageEmbed()
                        .setTitle('Some title')
                        .attachFiles([`${homeTeam.alias}${awayTeam.alias}.png`])
                        .addField('Lmao','Lmao')
                        .setThumbnail(`attachment://${homeTeam.alias}${awayTeam.alias}.png`);
                    message.channel.send({embed, files: [file]});
                    setTimeout(function () {
                        ImageHelper.removeImages(homeTeam, awayTeam)
                    }, 10000)
                })

            })
        } else {
            message.channel.send(`Không có kèo nào`)
        }
    }
}