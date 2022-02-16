module.exports = {
    name: `voiceStateUpdate`,
    async execute(oldMember, newMember) {
        if (isMaintenance(newMember.id)) return

        //Kick dai canali stats
        if (newMember.channelId == settings.idCanaliServer.codeSubscriberCounter || newMember.channelId == settings.idCanaliServer.giulioSubscriberCounter || newMember.channelId == settings.idCanaliServer.memberCounter) {
            var server = client.guilds.cache.get(settings.idServer);
            var utente = server.members.cache.find(x => x.id == newMember.id);
            utente.voice.kick()
        }

        if (oldMember.guild.id != settings.idServer) return

        //Canale no-mic-chat
        if (!oldMember.channelId && newMember.channelId) {
            var utente = client.guilds.cache.get(settings.idServer).members.cache.get(newMember.id)
            if (utente.bot) return
            if (utente) utente.roles.add(settings.idRuoloNoMicChat)
        }
        if (oldMember.channelId && !newMember.channelId) {
            var utente = client.guilds.cache.get(settings.idServer).members.cache.get(newMember.id)
            if (utente.bot) return
            if (utente) utente.roles.remove(settings.idRuoloNoMicChat)
        }
    },
};