const fs = require('fs');
const discord = require('discord.js');

const client = new discord.Client({ disableMentions: 'everyone' });

const { Player } = require('discord-player');

client.player = new Player(client);
client.config = require('./config/bot');
client.emotes = client.config.emojis;
client.filters = client.config.filters;
client.commands = new discord.Collection();

let timer = null


client.on('ready',() =>{setInterval(function(){
    const date = new Date();
    if(date.getHours() === 4)
    {
        const guild = client.guilds.cache.find(g => g.name === 'Land of Fuck b0ys');
        const channel = client.channels.cache.find(ch => ch.name.toLowerCase() ==="life-pro-tips");
        const onlinemembers = guild.members.cache.filter(mem => (mem.presence.status === 'online' || mem.presence.status ==='idle')&& !mem.user.bot);
        let strmem = ``;
        onlinemembers.map(member => {strmem+= `${member} `});
        channel.send(`Đi ngủ đi ${strmem}`);
    }
},1200000)})
fs.readdirSync('./commands').forEach(dirs => {
    const commands = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commands) {
        const command = require(`./commands/${dirs}/${file}`);
        console.log(`Loading command ${file}`);
        client.commands.set(command.name.toLowerCase(), command);
    };
});

const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const player = fs.readdirSync('./player').filter(file => file.endsWith('.js'));

for (const file of events) {
    console.log(`Loading discord.js event ${file}`);
    const event = require(`./events/${file}`);
    client.on(file.split(".")[0], event.bind(null, client));
};

for (const file of player) {
    console.log(`Loading discord-player event ${file}`);
    const event = require(`./player/${file}`);
    client.player.on(file.split(".")[0], event.bind(null, client));
};

client.login(client.config.discord.token);