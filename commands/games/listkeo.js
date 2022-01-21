const Match = require('../../models/match-schema')
const {MessageEmbed, MessageAttachment} = require('discord.js')
const ImageHelper = require('../../helpers/imageHelper')
module.exports = {
    name: 'listkeo',
    aliases: [],
    category: 'games',
    utilisation: '{prefix}listkeo',
    async execute(client,message,args){
        let embedList= []
        let list = await Match.find({}).where('status').in(['ongoing','na']).populate('homeTeam').populate('awayTeam').exec()
        list.forEach(match=>{
            let homeTeam = match.homeTeam
            let awayTeam = match.awayTeam
            ImageHelper.getMergeImage(homeTeam,awayTeam)
            const attachment = new MessageAttachment(`../../images/${homeTeam.alias}${awayTeam.alias}.png`,`${homeTeam.alias}${awayTeam.alias}.png`)
            const Embed = {
                color: 0x0099ff,
                title: 'Keo hom nay',
                description: 'Một số kèo ngày hôm nay',
                fields: [
                    {
                        name: 'Match id',
                        value: match._id
                    },
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: false,
                    },
                    {
                        name: 'Home',
                        value: homeTeam.name, 
                        inline:true
                    },
                    {
                        name: 'Away',
                        value: awayTeam.name,
                        inline: true
                    },
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: false,
                    },
                    {
                        name: 'Rate Home',
                        value: match.oddHome, 
                        inline:true
                    },
                    {
                        name: 'Rate Away',
                        value: match.oddAway,
                        inline: true
                    },
                    {
                        name: 'Inline field title',
                        value: 'Some value here',
                        inline: true,
                    },
                    {
                        name: 'Bắt đầu',
                        value: new Date(match.start),
                    },
                ],
                file:[
                    attachment
                ],
                image: {
                    url: `attachment:/${homeTeam.alias}${awayTeam.alias}.png`,
                },
                timestamp: new Date(),
                footer: {
                    text: 'Some footer text here',
                    icon_url: 'https://i.imgur.com/AfFp7pu.png',
                },
            };
            embedList.push(Embed)
        }) 
        if(embedList.length !=0){
            message.channel.send({ embeds: embedList });
        }else{
            message.channel.send('Không có kèo nào ngày hôm nay');
        }
    }
}