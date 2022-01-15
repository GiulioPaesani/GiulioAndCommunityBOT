module.exports = {
    name: "trename",
    aliases: [],
    onlyStaff: false,
    availableOnDM: false,
    description: "Rinominare il canale di un ticket",
    syntax: "!trename [name]",
    category: "community",
    channelsGranted: [],
    async execute(message, args, client, property) {
        if (!serverstats.ticket.find(x => x.channel == message.channel.id)) {
            return botCommandMessage(message, "CanaleNonConcesso", "", "", property)
        }

        var index = serverstats.ticket.findIndex(x => x.channel == message.channel.id);
        var ticket = serverstats.ticket[index];

        if (!utenteMod(message.author) && message.author.id != ticket.owner && !message.member.roles.cache.has(settings.idRuoloAiutante) && !message.member.roles.cache.has(settings.idRuoloAiutanteInProva)) {
            return botCommandMessage(message, "NonPermesso", "", "Non puoi eseguire il comando `!trename` in questo ticket")
        }

        var name = args.join(" ")
        if (!name) {
            return botCommandMessage(message, "Error", "Nome non valido", "Hai inserito un nome del canale non valido", property)
        }

        if (name.length > 100) {
            return botCommandMessage(message, "Error", "Nome troppo lungo", "Scrivi un nome non più lungo di 100 caratteri", property)
        }

        message.channel.setName(name)
            .then(canale => {
                botCommandMessage(message, "Correct", "Ticket rinominato", `Il ticket è stato rinominato in ${canale.name}`)
            })
    },
};