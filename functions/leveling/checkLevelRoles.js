const settings = require("../../config/general/settings.json")

const checkUserLevelRole = async (client, userstats) => {
    let ruoloDaAvere
    for (let i = userstats.leveling.level; !ruoloDaAvere && i > 0; i--) {
        if (settings.ruoliLeveling[i]) ruoloDaAvere = settings.ruoliLeveling[i]
    }

    let utente = client.guilds.cache.get(settings.idServer).members.cache.get(userstats.id);
    if (!utente) return

    for (let index in settings.ruoliLeveling) {
        if (utente.roles.cache.has(settings.ruoliLeveling[index]) && settings.ruoliLeveling[index] != ruoloDaAvere) await utente.roles.remove(settings.ruoliLeveling[index])
    }

    if (ruoloDaAvere && !utente.roles.cache.has(ruoloDaAvere)) {
        await utente.roles.add(ruoloDaAvere)
    }
}

module.exports = { checkUserLevelRole }