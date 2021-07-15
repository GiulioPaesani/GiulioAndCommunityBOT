module.exports = {
    name: `voiceStateUpdate`,
    async execute(oldMember, newMember) {
        //KICK FROM #member-counter e #subscriber
        if (newMember.channelID == "800802386587287562" || newMember.channelID == "801717800137129994") {
            var server = client.guilds.cache.get(config.idServer);
            var utente = server.members.cache.find(x => x.id == newMember.id);
            utente.voice.kick()
        }
    },
};