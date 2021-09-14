module.exports = {
    name: `voiceStateUpdate`,
    async execute(oldMember, newMember) {
        if (newMember.channelID == config.idCanaliServer.codeSubscriberCounter || newMember.channelID == config.idCanaliServer.giulioSubscriberCounter || newMember.channelID == config.idCanaliServer.memberCounter) {
            var server = client.guilds.cache.get(config.idServer);
            var utente = server.members.cache.find(x => x.id == newMember.id);
            utente.voice.kick()
        }
    },
};