const Discord = require('discord.js');
const moment = require('moment');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `roleUpdate`,
    client: "general",
    async execute(client, oldRole, newRole) {
        if (isMaintenance()) return

        if (newRole.guild.id != settings.idServer) return

        const fetchedLogs = await newRole.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_UPDATE',
        });

        const logs = fetchedLogs.entries.first();

        let embed = new Discord.MessageEmbed()
            .setTitle(":pencil: Role updated :pencil:")
            .setColor(colors.yellow)
            .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\nID: ${logs.executor.id}`, false)
            .addField(":shirt: Role", `@${oldRole.name} - ID: ${newRole.id}`)

        logs.changes.forEach(change => {
            if (!change.key.startsWith("permissions") && oldRole[change.key] != newRole[change.key]) {
                switch (change.key) {
                    case "color": change.old = `#${change.old.toString(16)}`; change.new = `#${change.new.toString(16)}`; break;
                }

                switch (change.key) {
                    case "name": change.key = "Name"; break;
                    case "color": change.key = "Color"; break;
                    case "hoist": change.key = "Separated"; break;
                    case "mentionable": change.key = "Mentionable"; break;
                    case "position": change.key = "Position"; break;
                    case "topic": change.key = "Topic"; break;
                }

                if (change.key != "Separated" && change.key != "Mentionable") {
                    if (!change.old) change.old = "_Null_"
                    if (!change.new) change.new = "_Null_"
                }

                embed
                    .addField(change.key, `
Old: ${change.old}
New: ${change.new}
`)
            }
        })

        if (logs.changes.find(x => x.key == "permissions")) {
            let permissionsText = ""

            let oldPermissions = oldRole.permissions.serialize()
            let newPermissions = newRole.permissions.serialize()

            permissions.forEach(permission => {
                oldPermissions[permission] = oldRole.permissions.has(permission)
                newPermissions[permission] = newRole.permissions.has(permission)
            })

            let changedPermissions = {}
            for (let permission in oldPermissions) {
                if (oldPermissions[permission] != newPermissions[permission])
                    changedPermissions[permission] = [oldPermissions[permission], newPermissions[permission]]
            }

            for (let permission in changedPermissions) {
                permissionsText += `${permission} - ${!changedPermissions[permission][0] ? ":red_circle:" : ":green_circle:"} > ${!changedPermissions[permission][1] ? ":red_circle:" : ":green_circle:"}\r`
            }

            if (permissionsText != "")
                embed
                    .addField(":gem: Permissions", permissionsText)
        }

        if (!embed.fields[4] && embed.fields[3] && embed.fields[3].name == "Position") {

        }
        else if (embed.fields[3]) {
            client.channels.cache.get(log.server.roles).send({ embeds: [embed] })
        }
    },
};