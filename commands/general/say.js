module.exports = {
    name: "say",
    aliases: [],
    onlyStaff: false,
    availableOnDM: false,
    description: "Far rispondere il bot con qualsiasi testo",
    syntax: "!say [text]",
    category: "fun",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var testo = args.join(" ");

        if (!testo) {
            return botCommandMessage(message, "Error", "Inserire un testo", "Scrivi il tempo che dovrà riprodurre il bot", property)
        }

        if (message.content.includes(`@everyone`) || message.content.includes(`@here`) || message.mentions.roles.first()) {
            return botCommandMessage(message, "Warning", "Non pingare nessun ruolo", "Scrivi un messaggio senza taggare ruoli del server")
        }

        var userstats = userstatsList.find(x => x.id == message.author.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        if (!utenteMod(message.author) && userstats.level < 15 && !message.member.roles.cache.has(settings.idRuoloServerBooster)) {
            return botCommandMessage(message, "Warning", "Non hai il livello", "Puoi utilizzare il comando `!say` solo dal **livello 15** o **boostando il server**")
        }

        message.delete()
            .catch(() => { })
        message.channel.send(testo)
    },
};