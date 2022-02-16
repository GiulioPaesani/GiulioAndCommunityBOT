module.exports = {
    name: "pkick",
    aliases: [],
    onlyStaff: false,
    availableOnDM: false,
    description: "Espellere un utente da una stanza vocale privata",
    syntax: "!pkick [user]",
    category: "privateRooms",
    channelsGranted: [],
    async execute(message, args, client, property) {
        var privaterooms = serverstats.privateRooms

        var room
        if (privaterooms.find(x => x.text == message.channel.id)) {
            if (message.author.id == privaterooms.find(x => x.text == message.channel.id).owner || utenteMod(message.author)) {
                room = privaterooms.find(x => x.text == message.channel.id)
            }
            else {
                return botCommandMessage(message, "NonPermesso", "", "Non hai il permesso di eseguire questo comando in questa stanza")
            }
        }
        else {
            if (!privaterooms.find(x => x.owner == message.author.id)) {
                return botCommandMessage(message, "Warning", "Non hai una stanza privata", "Per usare questo comando devi essere owner di una stanza privata")
            }
            room = privaterooms.find(x => x.owner == message.author.id)
        }

        if (room.type == "onlyText") {
            return botCommandMessage(message, "Error", "Non hai una stanza vocale", "Puoi kickare un utente solo da una stanza privata vocale", property)
        }

        var canale = client.channels.cache.get(room.voice)

        var utente = message.mentions.users?.first()
        if (!utente) {
            var utente = await getUser(args.join(" "))
        }

        if (!utente || !message.guild.members.cache.find(x => x.id == utente.id)) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Hai inserito un utente non disponibile o non valido", property)
        }

        if (!utente.voice || utente.voice.channelId != canale.id) {
            return botCommandMessage(message, "Error", "Utente non valido", "Questo utente non è presente nel tuo canale vocale", property)
        }

        if (utente.id == message.author.id) {
            return botCommandMessage(message, "Warning", "Non te stesso", "Non puoi kickare te stesso dal canale")
        }

        if (utenteMod(utente)) {
            return botCommandMessage(message, "NonPermesso", "", "Non hai il permesso di kickare questo utente")
        }

        utente.voice.kick()

        botCommandMessage(message, "Correct", "Utente kickato", `${utente.toString()} è stato kickato dalla tua stanza vocale, ma può rientrare quando vuole`)
    },
};
