const settings = require("../../config/general/settings.json")
const { getServer } = require('../database/getServer')
const { updateServer } = require('../database/updateServer')

const checkRoomInDB = async (client) => {
    let serverstats = await getServer()
    let changed = false

    serverstats.privateRooms.forEach(room => {
        if (!client.channels.cache.get(room.channel)) {
            serverstats.privateRooms = serverstats.privateRooms.filter(x => x.channel != room.channel);
            changed = true
        }
    })

    client.guilds.cache.get(settings.idServer).channels.cache.forEach(channel => {
        if (channel.parentId == settings.idCanaliServer.categoriaPrivateRooms && channel.id != settings.idCanaliServer.privateRooms) {
            if (!serverstats.privateRooms.find(x => x.channel == channel.id)) channel.delete().catch(() => { })
        }
    })

    if (changed) updateServer(serverstats)
}

module.exports = { checkRoomInDB }