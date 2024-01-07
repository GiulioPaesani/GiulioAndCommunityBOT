const settings = require("../../config/general/settings.json")

const hasSufficientLevels = (client, userstats, level) => {
    let server = client.guilds.cache.get(settings.idServer);

    let member = server.members.cache.get(userstats.id);

    if (level <= 30 && member.roles.cache.has(settings.idRuoloServerBooster)) return true

    if (level <= 60 && member.roles.cache.has(settings.idRuoloGiulioSub)) return true

    if (member.roles.cache.has(settings.idRuoloGiulioSubPro)) return true
    if (member.roles.cache.has(settings.idRuoloGiulioSubTwitch)) return true

    for (let i = level; i > 0; i -= 5) {
        if (member.roles.cache.find(x => x.name === `Level ${level}`)) return true;
    }

    return false
}

module.exports = { hasSufficientLevels }