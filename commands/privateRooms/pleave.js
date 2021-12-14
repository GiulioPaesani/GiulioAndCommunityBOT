module.exports = {
    name: "pleave",
    aliases: ["pesci"],
    onlyStaff: false,
    channelsGranted: [],
    async execute(message, args, client) {
        var privaterooms = serverstats.privateRooms

        if (!privaterooms.find(x => x?.text == message.channel.id)) {
            warning(message, "Non sei in una stanza", "Per porter uscire da una stanza, scrivi il comando in quella stanza privata")
            return
        }

        var room = privaterooms.find(x => x?.text == message.channel.id)
        if (!room.text) return

        if (room.owner == message.author.id) {
            warning(message, "Non nella tua stanza", "Non puoi uscire dalla tua stessa stanza")
            return
        }

        if (utenteMod(message.author)) {
            warning(message, "Non puoi uscire", "Putroppo sei un amministratore e non hai possibilità di uscire da questa stanza")
            return
        }

        correct(message, "Ti sei rimosso", `${message.author.toString()} tra 5 secondi verrai rimosso da questa stanza`)

        setTimeout(() => {
            if (room.text) {
                var canale = client.channels.cache.get(room.text)
                canale.updateOverwrite(message.member, {
                    VIEW_CHANNEL: false
                })
            }
            if (room.voice) {
                if (message.member.voice && message.member.voice.channelID == room.voice) message.member.voice.kick()
                var canale = client.channels.cache.get(room.voice)
                canale.updateOverwrite(message.member, {
                    VIEW_CHANNEL: false
                })
            }
        }, 5000)

    },
};
