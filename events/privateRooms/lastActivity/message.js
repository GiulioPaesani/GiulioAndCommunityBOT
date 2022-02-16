module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.author.bot) return
        if (!serverstats) return

        if (isMaintenance(message.author.id)) return

        if (serverstats.privateRooms.find(x => x.text == message.channel.id)) {
            var room = serverstats.privateRooms.find(x => x.text == message.channel.id)

            client.channels.cache.get(room.text).messages.fetch()
                .then(messages => {
                    var msg = messages.find(x => x.embeds[0]?.title == "Stanza un po' inattiva")
                    if (msg) msg.delete().catch(() => { })
                })

            serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.text == message.channel.id)].lastActivity = new Date().getTime()
            serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.text == message.channel.id)].lastActivityCount = 0
        }
    }
}