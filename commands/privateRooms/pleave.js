module.exports = {
    name: "pleave",
    aliases: [],
    onlyStaff: false,
    availableOnDM: false,
    description: "Uscire da una stanza privata",
    syntax: "!pleave (room)",
    category: "privateRooms",
    channelsGranted: [],
    async execute(message, args, client, property) {
        var privaterooms = serverstats.privateRooms

        if (!args[0]) {
            var canale = message.channel;
        }
        else {
            var canale = message.mentions.channels.first();
            if (!canale) {
                var canale = message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(canale => canale.name.toLowerCase() == args.join(" ")) || message.guild.channels.cache.find(canale => canale.name.slice(2).toLowerCase() == args.join(" ")) || message.guild.channels.cache.find(canale => canale.name.slice(3).toLowerCase() == args.join(" "))
            }
        }

        var room
        if (privaterooms.find(x => x.text == canale.id || x.voice == canale.id)) {
            room = privaterooms.find(x => x.text == canale.id || x.voice == canale.id)
        }

        if (!room) {
            return botCommandMessage(message, "Error", "Stanza non valida", "Non hai taggato o non sei in una stanza valida", property)
        }

        if (room.owner == message.author.id) {
            return botCommandMessage(message, "Warning", "Non puoi uscire", "Sei l'owner di questa stanza, non puoi uscire")
        }

        if (utenteMod(message.author)) {
            return botCommandMessage(message, "Warning", "Non puoi uscire", "Putroppo sei un amministratore e non hai possibilità di uscire da questa stanza")
        }

        botCommandMessage(message, "Correct", "Rimozione in corso...", `${message.author.toString()} tra qualche secondo verrai rimosso dalla stanza`)

        setTimeout(() => {
            if (room.text) {
                var canale = client.channels.cache.get(room.text)
                canale.permissionOverwrites.edit(message.member, {
                    VIEW_CHANNEL: false
                })
            }
            if (room.voice) {
                if (message.member.voice && message.member.voice.channelId == room.voice) message.member.voice.kick()
                var canale = client.channels.cache.get(room.voice)
                canale.permissionOverwrites.edit(message.member, {
                    VIEW_CHANNEL: false
                })
            }
        }, 5000)

    },
};
