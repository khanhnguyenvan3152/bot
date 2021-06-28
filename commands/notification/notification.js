
module.exports = {
    name: 'notification',
    aliases: [],
    category: 'notification',
    utilisation: '{}',

    execute(client, message) {
        const time = message.createAt.getHours();
        if(time === 20)
        {
            message.channel.send(`@${message.author} chưa đi ngủ à con đĩ`);
        }
    },
};