module.exports = {
    name: "premove",
    aliases: [],
    onlyStaff: false,
    availableOnDM: false,
    description: "Rimuovere un utente da una stanza privata",
    syntax: "!premove [user]",
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

        if (room.text)
            var canale = client.channels.cache.get(room.text)
        if (room.voice)
            var canale = client.channels.cache.get(room.voice)
        if (!canale) return

        var utente = message.mentions.users?.first()
        if (!utente) {
            var utente = await getUser(args.join(" "))
        }

        if (!utente || !message.guild.members.cache.find(x => x.id == utente.id)) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Hai inserito un utente non disponibile o non valido", property)
        }

        if (utenteMod(utente)) {
            return botCommandMessage(message, "NonPermesso", "", "Non hai il permesso di rimuovere questo utente")
        }

        const hasPermissionInChannel = canale
            .permissionsFor(utente)
            .has('VIEW_CHANNEL', true);

        if (!hasPermissionInChannel) {
            return botCommandMessage(message, "Error", "Utente già rimosso", room.type == "onlyText" || room.type == "onlyVoice" ? "Questo utente non ha già accesso alla tua stanza privata" : "Questo utente non ha già accesso alle tue stanze private", property)
        }

        if (message.member.id == utente.id) {
            return botCommandMessage(message, "Warning", "Non ti puoi rimuovere", room.type == "onlyText" || room.type == "onlyVoice" ? "Non puoi rimuoverti dalla stanza da solo" : "Non puoi rimuoverti dalle stanze da solo")
        }

        if (room.text) {
            var canale = client.channels.cache.get(room.text)
            canale.permissionOverwrites.edit(utente, {
                VIEW_CHANNEL: false
            })
        }
        if (room.voice) {
            if (utente.voice && utente.voice.channelId == room.voice) utente.voice.kick()
            var canale = client.channels.cache.get(room.voice)
            canale.permissionOverwrites.edit(utente, {
                VIEW_CHANNEL: false
            })
        }

        botCommandMessage(message, "Correct", "Utente rimosso", room.type == "onlyText" || room.type == "onlyVoice" ? `${utente.toString()} è stato rimosso dalla stanza` : `${utente.toString()} è stato rimosso dalle stanze`)
    },
};
