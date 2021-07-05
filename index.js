const fs = require('fs');
const discord = require('discord.js');

const client = new discord.Client({ disableMentions: 'everyone' });

const { Player, Discord } = require('discord-player');

client.player = new Player(client);
client.config = require('./config/bot');
client.emotes = client.config.emojis;
client.filters = client.config.filters;
client.commands = new discord.Collection();
client.cooldowns = new discord.Collection();
let timer = null
const NotificationLevels = ["Đi ngủ đi bạn êi","Bé ơi ngủ đi đêm đã khuya rồi","Ôi bạn ơi, sức đề kháng bạn kém là do bạn thức khuya nhiều đấy bạn ạ"]

client.on('ready',() =>{setInterval(function(){
  
},120000)})
//de fix sau
// const {cooldowns} = client;
// {
// if(!cooldowns.has(command.name))
//     cooldowns.set(command.name,new Discord.Collection())
// }

// const now = Date.now();
// const timestamps = cooldowns.get(command.name);
// const cooldownAmount = (command.cooldown || 1) * 1000;
// if(timestamps.has(message.author.id)){
//     const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
//     if(now < expirationTime){
//         const timeLeft = (expiritionTime - now)/1000;
//         return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\`command.`);
//     }
// };
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