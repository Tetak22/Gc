module.exports = {
    name: 'ban',
    description: "This command bans a member!",
    execute(message, args){
        const target = message.mentions.users.first();
        if(target){
            const memberTarget = message.guild.members.cache.get(target.id);
            memberTarget.ban();
            message.channel.send("Clan je banan!");
        }else{
            message.channel.send(`Ne mozes banati tog clana!`);
        }
    }
}