const settings = require("../../config/general/settings.json")

const hasSufficientLevels = (client, userstats, level) => {
    let server = client.guilds.cache.get(settings.idServer)

    if (userstats.leveling.level >= level || (level <= 30 && server.members.cache.get(userstats.id).roles.cache.has(settings.idRuoloServerBooster))) return true

    return false
}

module.exports = { hasSufficientLevels }