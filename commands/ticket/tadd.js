module.exports = {
    name: "tadd",
    aliases: [],
    onlyStaff: false,
    availableOnDM: false,
    description: "Aggiungere un utente a un ticket",
    syntax: "!tadd [user]",
    category: "community",
    channelsGranted: [],
    async execute(message, args, client, property) {
        if (!serverstats.ticket.find(x => x.channel == message.channel.id)) {
            return botCommandMessage(message, "CanaleNonConcesso", "", "", property)
        }

        var index = serverstats.ticket.findIndex(x => x.channel == message.channel.id);
        var ticket = serverstats.ticket[index];

        if (!utenteMod(message.author) && message.author.id != ticket.owner && !message.member.roles.cache.has(settings.idRuoloAiutante) && !message.member.roles.cache.has(settings.idRuoloAiutanteInProva)) {
            return botCommandMessage(message, "NonPermesso", "", "Non puoi eseguire il comando `!tadd` in questo ticket")
        }

        var utente = message.mentions.users?.first()
        if (!utente) {
            var utente = await getUser(args.join(" "))
        }

        if (!utente || !message.guild.members.cache.find(x => x.id == utente.id)) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Hai inserito un utente non disponibile o non valido", property)
        }

        const hasPermissionInChannel = message.channel
            .permissionsFor(utente)
            .has('VIEW_CHANNEL', true);

        if (hasPermissionInChannel) {
            return botCommandMessage(message, "Warning", "Utente già presente", "Questo utente ha già accesso a questo ticket")
        }

        message.channel.permissionOverwrites.edit(utente, {
            VIEW_CHANNEL: true
        })

        botCommandMessage(message, "Correct", "Utente aggiunto", `${utente.toString()} è stato aggiunto al ticket`)
    },
};