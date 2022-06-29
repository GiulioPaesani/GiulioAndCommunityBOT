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
const time_now = new Date().toLocaleString();

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        const maintenanceStates = await isMaintenance(message.author.id)
        if (maintenanceStates) return
        /*>*/ console.log(`event/message.js > isMaintenance > ${time_now}`);

        if (message.author.bot) return
        if (message.channel.type == "DM") return
        if (message.guild.id != settings.idServer) return

        if (message.channel.parentId == settings.idCanaliServer.categoriaAdmin || message.channel.parent?.parentId == settings.idCanaliServer.categoriaAdmin) return

        let userstats = await getUser(message.author.id); /*>*/ console.log(`event/message.js > Ottengo userstats utente > ${time_now}`);
        if (!userstats) userstats = await addUser(message.member); /*>*/ console.log(`event/message.js > Aggiungi userstats utente > ${time_now}`);

        if (!cooldownXp.has(message.author.id)) {
            let xp = Math.floor(Math.random() * (40 - 15 + 1)) + 15; /*>*/ console.log(`event/message.js > Calcolo random XP > ${time_now}`);

            if (userstats.birthday && ((userstats.birthday[0] == new Date().getMonth() + 1 && userstats.birthday[1] == new Date().getDate()) || (userstats.birthday[0] == 2 && userstats.birthday[1] == 29 && new Date().getMonth() == 2 && new Date().getDate() == 1))) {
                xp = xp * 2;
                /*>*/ console.log(`event/message.js > Raddopio XP per compleanno > ${time_now}`);
            }

            userstats.leveling.xp += xp;
            userstats = await checkLevelUp(client, userstats); /*>*/ console.log(`event/message.js > Controllo levelup > ${time_now}`);

            updateUser(userstats); /*>*/ console.log(`event/message.js > Update userstats > ${time_now}`);

            cooldownXp.set(message.author.id, 60); /*>*/ console.log(`event/message.js > Set cooldown xp utente > ${time_now}`);
        }
        else {
            checkUserLevelRole(client, userstats); /*>*/ console.log(`event/message.js > Controllo ruoli leveling utente > ${time_now}`);
        }
    },
};