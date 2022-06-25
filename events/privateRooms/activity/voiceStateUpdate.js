const { isMaintenance } = require("../../../functions/general/isMaintenance");
const { getServer } = require("../../../functions/database/getServer");
const { updateServer } = require("../../../functions/database/updateServer");

module.exports = {
    name: `voiceStateUpdate`,
    async execute(client, oldMember, newMember) {
        if (isMaintenance(newMember.id)) return

        let serverstats = await getServer()
        let room = serverstats.privateRooms.find(x => x.channel == newMember.channelId)
        if (!room) serverstats.privateRooms.find(x => x.channel == oldMember.channelId)
        if (!room) return

        if (!room.owners.includes(newMember.id)) return

        room.lastActivityCount = 0
        room.lastActivity = new Date().getTime()

        serverstats.privateRooms[serverstats.privateRooms.findIndex(x => x.channel == room.channel)] = room
        updateServer(serverstats)
    },
};