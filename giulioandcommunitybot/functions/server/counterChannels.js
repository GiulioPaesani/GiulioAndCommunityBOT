const settings = require("../../config/general/settings.json")

const counterChannels = (client) => {
    const server = client.guilds.cache.get(settings.idServer)
    const botCount = server.members.cache.filter(member => member.user.bot).size;
    const unverifiedCount = server.members.cache.filter(member => member.roles.cache.has(settings.idRuoloNonVerificato)).size;

    const utentiCount = server.memberCount - botCount - unverifiedCount;

    const canale = client.channels.cache.get(settings.idCanaliServer.memberCounter)
    if (canale.name != `👾│members: ${utentiCount}`)
        canale.setName(`👾│members: ${utentiCount}`)
}

module.exports = { counterChannels }