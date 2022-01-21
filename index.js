const fs = require('fs');
const discord = require('discord.js');

const client = new discord.Client({ disableMentions: 'everyone' });

const { Player } = require('discord-player');
const db = require('./models/db')
db.connect()

client.player = new Player(client);
client.config = require('./config/bot');
client.emotes = client.config.emojis;
client.filters = client.config.filters;
client.commands = new discord.Collection();


const NotificationLevels = ["Đi ngủ đi bạn êi","Bé ơi ngủ đi đêm đã khuya rồi","Ôi bạn ơi, sức đề kháng bạn kém là do bạn thức khuya nhiều đấy bạn ạ"]
class MemberNotification{
    id;
    count = 0;
    notify = function()
    {
        return NotificationLevels[this.count];
    }
    constructor(id)
    {
        this.id = id;
    };
    AwarenessIncrease()
    {
        if(count <2) count ++;
    }
}
var membersAwareness = [];
client.on('ready',() =>{setInterval(function(){
    const date = new Date();
    if(date.getHours() === 16)
    {
        const guild = client.guilds.cache.find(g => g.name === 'Land of Fuck b0ys');
        const channel = client.channels.cache.find(ch => ch.name.toLowerCase() ==="life-pro-tips");
        const onlinemembers = guild.members.cache.filter(mem => (mem.presence.status === 'online' || mem.presence.status ==='idle')&& !mem.user.bot);
        onlinemembers.map(member =>{
             let info = new MemberNotification(member.id); 
             if(membersAwareness.find(info.id)===undefined) 
             membersAwareness.push(info)})
        let strmem = ``;
        onlinemembers.map(member => {channel.send(`${member}` + membersAwareness.find(x=>x.id==member.id).notify)});
        
    }
},120000)})
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