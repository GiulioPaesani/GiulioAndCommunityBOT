module.exports = {
    name: `voiceStateUpdate`,
    async execute(oldMember, newMember) {
        if (isMaintenance(newMember.id)) return

        var room = serverstats.privateRooms.find(x => x.voice && x.voice == newMember.channelId)
        if (!room)
            room = serverstats.privateRooms.find(x => x.voice && x.voice == oldMember.channelId)

        if (!room) return

        serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.owner == room.owner)].lastActivity = new Date().getTime()
        serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.owner == room.owner)].lastActivityCount = 0

        if (room.text) {
            client.channels.cache.get(room.text).messages.fetch()
                .then(messages => {
                    var msg = messages.array().find(x => x.embeds[0]?.title == "Stanza un po' inattiva")
                    if (msg) msg.delete().catch(() => { })
                })
        }
    },
};