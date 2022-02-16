module.exports = {
    name: "tremove",
    aliases: [],
    onlyStaff: false,
    availableOnDM: false,
    description: "Rimuovere un utente da un ticket",
    syntax: "!tremove [user]",
    category: "community",
    channelsGranted: [],
    async execute(message, args, client, property) {
        if (!serverstats.ticket.find(x => x.channel == message.channel.id)) {
            return botCommandMessage(message, "CanaleNonConcesso", "", "", property)
        }

        var index = serverstats.ticket.findIndex(x => x.channel == message.channel.id);
        var ticket = serverstats.ticket[index];

        if (!utenteMod(message.author) && message.author.id != ticket.owner && !message.member.roles.cache.has(settings.idRuoloAiutante) && !message.member.roles.cache.has(settings.idRuoloAiutanteInProva)) {
            return botCommandMessage(message, "NonPermesso", "", "Non puoi eseguire il comando `!tremove` in questo ticket")
        }

        var utente = message.mentions.users?.first()
        if (!utente || !message.guild.members.cache.find(x => x.id == utente.id)) {
            var utente = await getUser(args.join(" "))
        }

        if (!utente) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Hai inserito un utente non disponibile o non valido", property)
        }

        const hasPermissionInChannel = message.channel
            .permissionsFor(utente)
            .has('VIEW_CHANNEL', true);

        if (!hasPermissionInChannel) {
            return botCommandMessage(message, "Warning", "Utente già rimosso", "Questo utente non ha già accesso a questo ticket")
        }

        if (utenteMod(utente)) {
            return botCommandMessage(message, "NonPermesso", "", "Non puoi rimuovere questo utente dal ticket")
        }

        if (message.channel.id == utente.id) {
            return botCommandMessage(message, "Warning", "Non ti puoi rimuovere", "Non ti puoi rimuovere da solo dal questo ticket")
        }

        message.channel.permissionOverwrites.edit(utente, {
            VIEW_CHANNEL: false
        })

        botCommandMessage(message, "Correct", "Utente rimosso", `${utente.toString()} è stato rimosso dal ticket`)
    },
};