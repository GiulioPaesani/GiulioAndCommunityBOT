module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id != "annullaEliminazione") return

        button.reply.defer()

        if (isMaintenance(button.clicker.user.id)) return

        var room
        if (button.message.channel.type == "dm")
            room = serverstats.privateRooms.find(x => x.owner == button.clicker.user.id)
        else
            room = serverstats.privateRooms.find(x => x.text == button.message.channel.id)

        if (!room) return

        serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.owner == room.owner)].lastActivity = new Date().getTime()
        serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.owner == room.owner)].lastActivityCount = 0

        button.message.delete()
    },
};