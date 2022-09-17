const settings = require("../../config/general/settings.json")

const hasSufficientLevels = (client, userstats, level) => {
    let server = client.guilds.cache.get(settings.idServer);

    if (userstats.leveling.level >= level) return true

    if (level <= 30 && server.members.cache.get(userstats.id).roles.cache.has(settings.idRuoloServerBooster)) return true

    if (level <= 60 && server.members.cache.get(userstats.id).roles.cache.has(settings.idRuoloGiulioSub)) return true

    if (server.members.cache.get(userstats.id).roles.cache.has(settings.idRuoloGiulioSubPro)) return true
    if (server.members.cache.get(userstats.id).roles.cache.has(settings.idRuoloGiulioSubTwitch)) return true

    return false
}

module.exports = { hasSufficientLevels }