const Discord = require('discord.js');
const moment = require('moment');
const settings = require('../../../config/general/settings.json');
const log = require("../../../config/general/log.json")
const colors = require("../../../config/general/colors.json")
const { isMaintenance } = require("../../../functions/general/isMaintenance");

module.exports = {
    name: `channelUpdate`,
    client: "general",
    async execute(client, oldChannel, newChannel) {
        if (isMaintenance()) return

        if (newChannel.guild?.id != settings.idServer) return

        if (Array.from(oldChannel.permissionOverwrites.cache.values()) != Array.from(newChannel.permissionOverwrites.cache.values())) {
            const fetchedLogs = await newChannel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_OVERWRITE_UPDATE',
            });

            const logs = fetchedLogs.entries.first();

            let embed = new Discord.MessageEmbed()
                .setTitle(":pencil: Channel updated :pencil:")
                .setColor(colors.yellow)
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\rID: ${logs.executor.id}`)
                .addField(":anchor: Channel", `${newChannel.toString()} - #${newChannel.name}\nID: ${newChannel.id}`)

            let permissionsText = ""
            Array.from(oldChannel.permissionOverwrites.cache.values()).forEach(permission => {
                if (!Array.from(newChannel.permissionOverwrites.cache.values()).find(x => x.id == permission.id)) {
                    permissionsText += permission.type == "member" ? `User: <@${permission.id}> - ID: ${permission.id}\r` : `Role: @${newChannel.guild.roles.cache.find(y => y.id == permission.id).name}\r`
                    permissionsText += permission.type == "member" ? `_User removed_\r` : `_Role removed_\r`

                    let permissionsAllow = permission.allow.serialize() || {}
                    let permissionsDeny = permission.deny.serialize() || {}

                    let permissions = { ...permissionsAllow }
                    for (let permission2 in permissions) {
                        if (!permissionsAllow[permission2] && !permissionsDeny[permission2])
                            permissions[permission2] = 0
                        else if (permissionsAllow[permission2] && !permissionsDeny[permission2])
                            permissions[permission2] = 1
                        else if (!permissionsAllow[permission2] && permissionsDeny[permission2])
                            permissions[permission2] = -1
                    }

                    for (let permission3 in permissions) {
                        if (permissions[permission3] != 0)
                            permissionsText += `${permission3} - ${permissions[permission3] == -1 ? ":red_circle:" : ":green_circle:"}\r`
                    }
                }
            })

            if (permissionsText != "") {
                embed.addField(":gem: Permissions", permissionsText.length > 1024 ? `${permissionsText.slice(0, 1019)}...\r` : permissionsText)

                client.channels.cache.get(log.server.channels).send({ embeds: [embed] })
                return
            }

            Array.from(oldChannel.permissionOverwrites.cache.values()).forEach(permission => {
                if (JSON.stringify(Array.from(newChannel.permissionOverwrites.cache.values()).find(x => x.id == permission.id)) != JSON.stringify(permission)) {
                    permissionsText += permission.type == "member" ? `User: <@${permission.id}> - ID: ${permission.id}\r` : `Role: @${newChannel.guild.roles.cache.find(y => y.id == permission.id).name}\r`

                    let oldPermissionsAllow = permission.allow.serialize() || {}
                    let oldPermissionsDeny = permission.deny.serialize() || {}

                    let oldPermissions = { ...oldPermissionsAllow }
                    for (let permission2 in oldPermissions) {
                        if (!oldPermissionsAllow[permission2] && !oldPermissionsDeny[permission2])
                            oldPermissions[permission2] = 0
                        else if (oldPermissionsAllow[permission2] && !oldPermissionsDeny[permission2])
                            oldPermissions[permission2] = 1
                        else if (!oldPermissionsAllow[permission2] && oldPermissionsDeny[permission2])
                            oldPermissions[permission2] = -1
                    }

                    let newPermissionsAllow = Array.from(newChannel.permissionOverwrites.cache.values()).find(x => x.id == permission.id).allow.serialize() || {}
                    let newPermissionsDeny = Array.from(newChannel.permissionOverwrites.cache.values()).find(x => x.id == permission.id).deny.serialize() || {}

                    let newPermissions = { ...newPermissionsAllow }
                    for (let permission3 in newPermissions) {
                        if (!newPermissionsAllow[permission3] && !newPermissionsDeny[permission3])
                            newPermissions[permission3] = 0
                        else if (newPermissionsAllow[permission3] && !newPermissionsDeny[permission3])
                            newPermissions[permission3] = 1
                        else if (!newPermissionsAllow[permission3] && newPermissionsDeny[permission3])
                            newPermissions[permission3] = -1
                    }

                    let changedPermissions = {}
                    for (let permission2 in oldPermissions) {
                        if (oldPermissions[permission2] != newPermissions[permission2])
                            changedPermissions[permission2] = [oldPermissions[permission2], newPermissions[permission2]]
                    }

                    for (let permission2 in changedPermissions) {
                        permissionsText += `${permission2} - ${changedPermissions[permission2][0] == -1 ? ":red_circle:" : changedPermissions[permission2][0] == 0 ? ":white_circle:" : ":green_circle:"} > ${changedPermissions[permission2][1] == -1 ? ":red_circle:" : changedPermissions[permission2][1] == 0 ? ":white_circle:" : ":green_circle:"}\r`
                    }

                }
            })

            if (permissionsText != "") {
                embed.addField(":gem: Permissions", permissionsText.length > 1024 ? `${permissionsText.slice(0, 1019)}...\r` : permissionsText)

                client.channels.cache.get(log.server.channels).send({ embeds: [embed] })
                return
            }
        }
        else {
            const fetchedLogs = await newChannel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_UPDATE',
            });

            const logs = fetchedLogs.entries.first();

            if (new Date().getTime() - logs.createdAt.getTime() > 7000) return

            let embed = new Discord.MessageEmbed()
                .setTitle(":pencil: Channel updated :pencil:")
                .setColor(colors.yellow)
                .addField(":alarm_clock: Time", `${moment().format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":brain: Executor", `${logs.executor.toString()} - ${logs.executor.tag}\rID: ${logs.executor.id}`)
                .addField(":anchor: Channel", `${oldChannel.toString()} - #${oldChannel.name}\nID: ${oldChannel.id}`)

            logs.changes.forEach(change => {
                switch (change.key) {
                    case "nsfw": change.old ? change.old = "Enabled" : change.old = "Disabled"; change.new ? change.new = "Enabled" : change.new = "Disabled"; break;
                    case "rate_limit_per_user": change.old == 0 ? change.old = "Disabled" : change.old = ms(change.old * 1000, { long: true }); change.new == 0 ? change.new = "Disabled" : change.new = ms(change.new * 1000, { long: true }); break;
                }

                switch (change.key) {
                    case "name": change.key = "Name"; break;
                    case "bitrate": change.key = "Bitrate"; break;
                    case "nsfw": change.key = "NSFW"; break;
                    case "position": change.key = "Position"; break;
                    case "rate_limit_per_user": change.key = "Slowmode"; break;
                    case "topic": change.key = "Topic"; break;
                }

                if (!change.old) change.old = "_Null_"
                if (!change.new) change.new = "_Null_"

                embed
                    .addField(change.key, `
Old: ${change.old}
New: ${change.new}
`)
            })

            client.channels.cache.get(log.server.channels).send({ embeds: [embed] })
        }
    },
};