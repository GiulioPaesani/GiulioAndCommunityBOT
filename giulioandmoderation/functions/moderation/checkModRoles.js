const settings = require("../../config/general/settings.json");
const { getAllUsers } = require("../database/getAllUsers");
const { getUser } = require("../database/getUser.js")
const { addUser } = require("../database/addUser.js");
const { updateUser } = require("../database/updateUser");
const { isMaintenance } = require("../general/isMaintenance");

const checkModRoles = async (client) => {
    let userstatsList = getAllUsers(client, true);

    userstatsList.filter(x => x.moderation.type != "")
        .forEach(async userstats => {
            let utente = client.guilds.cache.get(settings.idServer).members.cache.get(userstats.id);

            if (!isMaintenance(utente.id)) {
                switch (userstats.moderation.type) {
                    case "Muted": {
                        if (!utente.roles.cache.has(settings.ruoliModeration.muted)) await utente.roles.add(settings.ruoliModeration.muted);
                        if (utente.roles.cache.has(settings.ruoliModeration.tempmuted)) await utente.roles.remove(settings.ruoliModeration.tempmuted);
                        if (utente.roles.cache.has(settings.ruoliModeration.banned)) await utente.roles.remove(settings.ruoliModeration.banned);
                        if (utente.roles.cache.has(settings.ruoliModeration.tempbanned)) await utente.roles.remove(settings.ruoliModeration.tempbanned);
                    } break;
                    case "Tempmuted": {
                        if (!utente.roles.cache.has(settings.ruoliModeration.tempmuted)) await utente.roles.add(settings.ruoliModeration.tempmuted);
                        if (utente.roles.cache.has(settings.ruoliModeration.muted)) await utente.roles.remove(settings.ruoliModeration.muted);
                        if (utente.roles.cache.has(settings.ruoliModeration.banned)) await utente.roles.remove(settings.ruoliModeration.banned);
                        if (utente.roles.cache.has(settings.ruoliModeration.tempbanned)) await utente.roles.remove(settings.ruoliModeration.tempbanned);
                    } break;
                    case "Banned": {
                        if (!utente.roles.cache.has(settings.ruoliModeration.banned)) await utente.roles.add(settings.ruoliModeration.banned);
                        if (utente.roles.cache.has(settings.ruoliModeration.muted)) await utente.roles.remove(settings.ruoliModeration.muted);
                        if (utente.roles.cache.has(settings.ruoliModeration.tempmuted)) await utente.roles.remove(settings.ruoliModeration.tempmuted);
                        if (utente.roles.cache.has(settings.ruoliModeration.tempbanned)) await utente.roles.remove(settings.ruoliModeration.tempbanned);
                    } break;
                    case "Tempbanned": {
                        if (!utente.roles.cache.has(settings.ruoliModeration.tempbanned)) await utente.roles.add(settings.ruoliModeration.tempbanned);
                        if (utente.roles.cache.has(settings.ruoliModeration.muted)) await utente.roles.remove(settings.ruoliModeration.muted);
                        if (utente.roles.cache.has(settings.ruoliModeration.tempmuted)) await utente.roles.remove(settings.ruoliModeration.tempmuted);
                        if (utente.roles.cache.has(settings.ruoliModeration.banned)) await utente.roles.remove(settings.ruoliModeration.banned);
                    } break;
                    case "Forcebanned": {
                        if (utente.roles.cache.has(settings.ruoliModeration.muted)) await utente.roles.remove(settings.ruoModeration.muted);
                        if (utente.roles.cache.has(settings.ruoliModeration.tempmuted)) await utente.roles.remove(settings.ruoliModeration.tempmuted);
                        if (utente.roles.cache.has(settings.ruoliModeration.banned)) await utente.roles.remove(settings.ruoliModeration.banned);
                        if (utente.roles.cache.has(settings.ruoliModeration.tempbanned)) await utente.roles.remove(settings.ruoliModeration.tempbanned);
                        await client.guilds.cache.get(settings.idServer).members.ban(utente.id, { reason: userstats.moderation.reason })
                    } break;
                }
            }
        })

    client.guilds.cache.get(settings.idServer).members.cache.forEach(async utente => {
        if (!isMaintenance(utente.id)) {
            if (utente.roles.cache.has(settings.ruoliModeration.muted) && !userstatsList.find(x => x.id == utente.id && x.moderation.type == "Muted")) {
                await utente.roles.remove(settings.ruoliModeration.muted);
            }
            if (utente.roles.cache.has(settings.ruoliModeration.tempmuted) && !userstatsList.find(x => x.id == utente.id && x.moderation.type == "Tempmuted")) {
                await utente.roles.remove(settings.ruoliModeration.tempmuted);
            }
            if (utente.roles.cache.has(settings.ruoliModeration.banned) && !userstatsList.find(x => x.id == utente.id && x.moderation.type == "Banned")) {
                await utente.roles.remove(settings.ruoliModeration.banned);
            }
            if (utente.roles.cache.has(settings.ruoliModeration.tempbanned) && !userstatsList.find(x => x.id == utente.id && x.moderation.type == "Tempbanned")) {
                await utente.roles.remove(settings.ruoliModeration.tempbanned);
            }
        }
    })

    await client.guilds.cache.get(settings.idServer).bans.fetch()
        .then(async banned => {
            banned.forEach(ban => {
                let userstats = getUser(ban.user.id);
                if (!userstats) userstats = addUser(ban.user)[0];

                if (userstats.moderation.type != "Forcebanned") {
                    userstats.moderation = {
                        type: "Forcebanned",
                        since: new Date().getTime(),
                        until: null,
                        reason: ban.reason || "No reason",
                        moderator: client.user.id,
                        ticketOpened: false
                    }
                    userstats.warns.push({
                        type: "fban",
                        reason: ban.reason || "No reason",
                        time: new Date().getTime(),
                        moderator: client.user.id,
                        unTime: null,
                        unModerator: null
                    })
                    updateUser(userstats)
                }


            })
        })
}

module.exports = { checkModRoles };