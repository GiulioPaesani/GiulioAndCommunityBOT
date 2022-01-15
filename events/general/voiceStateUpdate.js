module.exports = {
    name: `voiceStateUpdate`,
    async execute(oldMember, newMember) {
        if (isMaintenance(newMember.id)) return

        //Kick dai canali stats
        if (newMember.channelID == settings.idCanaliServer.codeSubscriberCounter || newMember.channelID == settings.idCanaliServer.giulioSubscriberCounter || newMember.channelID == settings.idCanaliServer.memberCounter) {
            var server = client.guilds.cache.get(settings.idServer);
            var utente = server.members.cache.find(x => x.id == newMember.id);
            utente.voice.kick()
        }

        if (oldMember.guild.id != settings.idServer) return

        //Canale no-mic-chat
        if (!oldMember.channelID && newMember.channelID) {
            var utente = client.guilds.cache.get(settings.idServer).members.cache.get(newMember.id)
            if (utente.bot) return
            if (utente) utente.roles.add(settings.idRuoloNoMicChat)
        }
        if (oldMember.channelID && !newMember.channelID) {
            var utente = client.guilds.cache.get(settings.idServer).members.cache.get(newMember.id)
            if (utente.bot) return
            if (utente) utente.roles.remove(settings.idRuoloNoMicChat)
        }
    },
};