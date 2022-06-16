const settings = require("../../config/general/settings.json")

const checkUserLevelRole = async (client, userstats) => {
    let ruoloDaAvere
    for (let i = userstats.leveling.level; !ruoloDaAvere; i--) {
        if (client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == `Level ${i}`)) ruoloDaAvere = i
    }

    let utente = client.guilds.cache.get(settings.idServer).members.cache.get(userstats.id)
    if (!utente) return
    let role = client.guilds.cache.get(settings.idServer).roles.cache.find(x => x.name == `Level ${ruoloDaAvere}`)

    client.guilds.cache.get(settings.idServer).roles.cache.filter(x => x.name.startsWith("Level")).forEach(async ruolo => {
        if (utente.roles.cache.has(ruolo.id) && ruolo.id != role.id) await utente.roles.remove(ruolo.id)
    })

    if (!utente.roles.cache.has(role.id)) await utente.roles.add(role.id)
}

module.exports = { checkUserLevelRole }