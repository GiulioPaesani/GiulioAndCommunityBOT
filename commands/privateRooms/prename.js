module.exports = {
    name: "prename",
    aliases: [],
    onlyStaff: false,
    availableOnDM: false,
    description: "Rinominare una stanza privata",
    syntax: "!prename [name]",
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

        if (room.type == "textVoice") {
            return botCommandMessage(message, "Error", "Quale canale vuoi rinominare?", "Hai due canali privati e puoi rinominarli **diversamente** entrambi. Per il canale **tesuale** utilizza \`!ptrename [name]\` mentre per il canale **vocale** usa \`!pvrename [name]\`", property)
        }

        var name = args.join(" ")
        if (!name) {
            return botCommandMessage(message, "Error", "Nome non valido", "Hai inserito un nome del canale non valido", property)
        }

        if (name.length > 100) {
            return botCommandMessage(message, "Error", "Nome troppo lungo", "Scrivi un nome non più lungo di 100 caratteri", property)
        }

        if (room.text) {
            var canale = client.channels.cache.get(room.text)
            canale.setName(name)
                .then(() => botCommandMessage(message, "Correct", "Stanza rinominata", `La stanza è stata rinominata in \`${canale.name}\``))
                .catch(() => { return botCommandMessage(message, "Error", "Nome non valido", "Hai inserito un nome del canale non valido", property) })
        }
        if (room.voice) {
            var canale = client.channels.cache.get(room.voice)
            canale.setName(name)
                .then(() => botCommandMessage(message, "Correct", "Stanza rinominata", `La stanza è stata rinominata in \`${canale.name}\``))
                .catch(() => { return botCommandMessage(message, "Error", "Nome non valido", "Hai inserito un nome del canale non valido", property) })
        }
    },
};
