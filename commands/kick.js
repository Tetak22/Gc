module.exports = {
    name: 'kick',
    description: "This command kicks a member!",
    execute(message, args){
        const target = message.mentions.users.first();
        if(target){
            const memberTarget = message.guild.members.cache.get(target.id);
            memberTarget.kick();
            message.channel.send("Clan je kickan!");
        }else{
            message.channel.send(`Ne mozes kickati tog clana!`);
        }
    }
}