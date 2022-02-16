module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (button.customId != "annullaEliminazione") return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        var room
        if (button.message.channel.type == "DM")
            room = serverstats.privateRooms.find(x => x.owner == button.user.id)
        else
            room = serverstats.privateRooms.find(x => x.text == button.message.channel.id)

        if (!room) return

        serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.owner == room.owner)].lastActivity = new Date().getTime()
        serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.owner == room.owner)].lastActivityCount = 0

        button.message.delete()
            .catch(() => { })
    },
};