module.exports = {
    name: "padd",
    aliases: [],
    onlyStaff: false,
    availableOnDM: false,
    description: "Aggiungere un utente a una stanza privata",
    syntax: "!padd [user]",
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

        if (room.bans.includes(utente.id)) {
            return botCommandMessage(message, "Warning", "Utente bannato", room.type == "onlyText" || room.type == "onlyVoice" ? "Non puoi aggiungere un utente bannato dalla tua stanza" : "Non puoi aggiungere un utente bannato dalle tue stanze")
        }

        const hasPermissionInChannel = canale
            .permissionsFor(utente)
            .has('VIEW_CHANNEL', true);

        if (hasPermissionInChannel) {
            return botCommandMessage(message, "Warning", "Utente già presente", room.type == "onlyText" || room.type == "onlyVoice" ? "Questo utente ha già accesso alla tua stanza privata" : "Questo utente ha già accesso alle tue stanze private")
        }

        if (room.text) {
            var canale = client.channels.cache.get(room.text)
            canale.permissionOverwrites.edit(utente, {
                VIEW_CHANNEL: true
            })
        }
        if (room.voice) {
            var canale = client.channels.cache.get(room.voice)
            canale.permissionOverwrites.edit(utente, {
                VIEW_CHANNEL: true
            })
        }

        botCommandMessage(message, "Correct", "Utente aggiunto", room.type == "onlyText" || room.type == "onlyVoice" ? `${utente.toString()} è stato aggiunto alla stanza` : `${utente.toString()} è stato aggiunto alle stanze`)
    },
};
