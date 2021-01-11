const { executionAsyncResource } = require('async_hooks');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const { YTSearcher } = require('ytsearcher');

const searcher = new YTSearcher({
    key: process.env.youtube_api,
    revealed: true
});

const client = new Discord.Client();

const queue = new Map();

const prefix = '$';

const fs = require('fs');
const { emitKeypressEvents } = require('readline');
const { execute } = require('./commands/ban');
const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } = require('constants');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once ('ready', () => {
    console.log('GC bot je online!');
    client.user.setActivity('GAMING CHILL DISCORD SERVER!', { type: 'WATCHING'});
});

client.on('guildMemberAdd', guildMember =>{
    let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === 'marine');

    guildMember.roles.add(welcomeRole);
    guildMember.guild.channels.cache.get('730857582486618163').send(`Dobrodosao <@${guildMember.user.id}> na Gaming Chill discord server zabavi se!`)
});
    


client.on("message" , async(message) =>{
    const serverQueue = queue.get(message.guild.id);
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch(command){
        case "p":
            execute(message, serverQueue);
            break;
        case "s":
            execute(message, serverQueue);
            break;
            
    }
    if(command === 'clear'){
        client.commands.get('clear').execute(message, args);
    } else if(command === 'kick'){
        client.commands.get('kick').execute(message, args);
    } else if(command === 'ban'){
        client.commands.get('ban').execute(message, args);
    } else if(command === 'mute'){
        client.commands.get('mute').execute(message, args);
    } else if(command === 'unmute'){
        client.commands.get('unmute').execute(message, args);
    }           
     async function execute(message, serverQueue){
         let vd = message.member.voice.channel;
         if(!vc){
             return message.channel.send("Molim te prvo udi u call!");
         }else{
             let result = await searcher.search(args.join(" "), { type: "video"})

             let song = {
                 title: songInfo.videoDetails.title,
                 url: songInfo.videoDetails.vide_url
             };

             if(!serverQueue){
                 const queueConstructor= {
                     txtChannel: message.channel,
                     vChannel: vc,
                     connection: null,
                     songs: [],
                     volume: 10,
                     playing: true
                 };
                 queue.set(message.guild.id, queueConstructor);

                 queueConstructor.songs.push(song);

                 try{
                     let connection = await vc.join();
                     queueConstructor.connection = connection;
                     play(message.guild, queueConstructor.songs[0]);
                 }catch (err){
                     console.error(err);
                     queue.delete(message.guild.id);
                     return message.channel.send(`Ne mogu uci u call ${err}`)
                 }
             }else{
                 serverQueue.songs.push(song);
                 return message.channel.send(`Pijesma je dodana u que ${song.url}`);
             }
         }
     }   
     function play(guild, song){
        const serverQueue = queue.get(guild.id);
        if(!song){
            serverQueue.vChannel.leave();
            queue.delete(guild.id);
            return;
        }
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on('finish', () =>{
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0]);
            })
            serverQueue.txtChannel.send(`:thumbsup:Sada slusamo ${serverQueue.songs[0].url}`)
    }
    function stop (message, serverQueue){
        if(!message.member.voice.channel)
            return message.channel.send("Moras uci u call prvo!")
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    }
    function skip (message, serverQueue){
        if(!message.member.voice.channel)
            return message.channel.send("Moras biti u callu da bi skipo");
        if(!serverQueue)
            return message.channel.send("Nema nista za skipati!");
        serverQueue.connection.dispatcher.end();
    }

});  

client.login(process.env.token);