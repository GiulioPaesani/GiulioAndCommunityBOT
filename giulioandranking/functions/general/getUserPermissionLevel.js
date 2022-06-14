const settings = require("../../config/general/settings.json")

const getUserPermissionLevel = (client, userId) => {
    const member = client.guilds.cache.get(settings.idServer).members.cache.get(userId)
    if (!member) return 0

    if (member.roles.cache.has(settings.ruoliStaff.owner)) return 3
    if (member.roles.cache.has(settings.ruoliStaff.admin)) return 2
    if (member.roles.cache.has(settings.ruoliStaff.moderatore)) return 1

    return 0
}

module.exports = { getUserPermissionLevel }