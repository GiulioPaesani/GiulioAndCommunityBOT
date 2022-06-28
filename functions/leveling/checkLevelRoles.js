const settings = require("../../config/general/settings.json")
const time_now = new Date().toLocaleString();

const checkUserLevelRole = async (client, userstats) => {
    let ruoloDaAvere
    for (let i = userstats.leveling.level; !ruoloDaAvere && i > 0; i--) {
        /*>*/ console.log(`functions/checkLevelRoles.js > Inizio ciclo "for" calcolo ruoloDaAvere (${i}) > ${time_now}`);
        if (settings.ruoliLeveling[i]) ruoloDaAvere = settings.ruoliLeveling[i]
    }

    let utente = client.guilds.cache.get(settings.idServer).members.cache.get(userstats.id); /*>*/ console.log(`functions/checkLevelRoles.js > Ottengo utente > ${time_now}`);
    if (!utente) return

    for (let index in settings.ruoliLeveling) {
        /*>*/ console.log(`functions/checkLevelRoles.js > Inizio ciclo "for" rimozione ruoli non necessari (${index}) > ${time_now}`);
        if (utente.roles.cache.has(settings.ruoliLeveling[index]) && settings.ruoliLeveling[index] != ruoloDaAvere) await utente.roles.remove(settings.ruoliLeveling[index])
    }

    if (!utente.roles.cache.has(ruoloDaAvere)) {
        await utente.roles.add(ruoloDaAvere)
        /*>*/ console.log(`functions/checkLevelRoles.js > Aggiunta ruolo ruoloDaAvere > ${time_now}`);
    }
}

module.exports = { checkUserLevelRole }