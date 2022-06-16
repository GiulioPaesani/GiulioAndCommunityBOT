const settings = require("../../config/general/settings.json")
const { isMaintenance } = require("../../functions/general/isMaintenance")
const { addUser } = require("../../functions/database/addUser")
const { getUser } = require("../../functions/database/getUser")
const { updateUser } = require("../../functions/database/updateUser")
const { checkLevelUp } = require("../../functions/leveling/checkLevelUp")
const { cooldownXp } = require("../../functions/leveling/cooldownXp")
const { checkBadwords } = require("../../functions/moderation/checkBadwords")
const { getUserPermissionLevel } = require("../../functions/general/getUserPermissionLevel")
const { checkUserLevelRole } = require("../../functions/leveling/checkLevelRoles")

module.exports = {
    name: "messageCreate",
    client: "ranking",
    async execute(client, message) {
        if (isMaintenance(message.author.id)) return

        if (message.author.bot) return
        if (message.channel.type == "DM") return
        if (message.guild.id != settings.idServer) return

        if (message.channel.parentId == settings.idCanaliServer.categoriaAdmin || message.channel.parent?.parentId == settings.idCanaliServer.categoriaAdmin) return

        let [trovata, nonCensurato, censurato] = checkBadwords(message.content);
        if (trovata && !getUserPermissionLevel(client, message.author.id) && !message.member.roles.cache.has(settings.idRuoloFeatureActivator)) return

        let userstats = getUser(message.author.id)
        if (!userstats) userstats = addUser(message.member)[0]

        if (!cooldownXp.has(message.author.id)) {
            let xp = Math.floor(Math.random() * (40 - 15 + 1)) + 15;

            if (userstats.birthday && ((userstats.birthday[0] == new Date().getMonth() + 1 && userstats.birthday[1] == new Date().getDate()) || (userstats.birthday[0] == 2 && userstats.birthday[1] == 29 && new Date().getMonth() == 2 && new Date().getDate() == 1))) {
                xp = xp * 2
            }

            userstats.leveling.xp += xp;
            userstats = await checkLevelUp(client, userstats)

            updateUser(userstats)

            cooldownXp.set(message.author.id, 60)

            checkUserLevelRole(client, userstats)
        }
    },
};