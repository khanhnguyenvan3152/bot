module.exports = {
    name: 'padoru',
    aliases: [],
    category: 'Infos',
    utilisation: '{prefix}padoru',

    execute(client, message,args) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);

        

        client.player.play(message,'https://www.youtube.com/watch?v=dQ_d_VKrFgM');
    }
}