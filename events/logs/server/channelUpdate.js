module.exports = {
    name: `channelUpdate`,
    async execute(oldChannel, newChannel) {
        // if (isMaintenance()) return

        if (newChannel.guild?.id != settings.idServer) return

        if (JSON.stringify(oldChannel.permissionOverwrites) != JSON.stringify(newChannel.permissionOverwrites)) {
            const fetchedLogs = await newChannel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_OVERWRITE_UPDATE',
            });

            const logs = fetchedLogs.entries.first();

            if (logs.executor.bot) return

            if (new Date().getTime() - logs.createdAt > 10000) return

            var embed = new Discord.MessageEmbed()
                .setTitle(":pencil: Channel updated :pencil:")
                .setColor("#fcba03")
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
                .addField("Channel", `#${newChannel.name}`)

            for (var permission in Object.fromEntries(oldChannel.permissionOverwrites)) {
                if (!Object.fromEntries(newChannel.permissionOverwrites)[permission]) {
                    var permissionsText = Object.fromEntries(oldChannel.permissionOverwrites)[permission].type == "member" ? `User: <@${permission}>\r` : `Role: ${client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == newChannel.guild.roles.cache.find(y => y.id == permission)?.name) ? `<@${client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == newChannel.guild.roles.cache.find(y => y.id == permission).name).id}>` : `@${newChannel.guild.roles.cache.find(y => y.id == permission).name}`}\r`
                    permissionsText += Object.fromEntries(oldChannel.permissionOverwrites)[permission].type == "member" ? `_User removed_\r` : `_Role removed_\r`

                    var permissionsAllow = Object.fromEntries(oldChannel.permissionOverwrites)[permission]?.allow.serialize() || {}
                    var permissionsDeny = Object.fromEntries(oldChannel.permissionOverwrites)[permission]?.deny.serialize() || {}

                    var permissions = { ...permissionsAllow }
                    for (var permission2 in permissions) {
                        if (!permissionsAllow[permission2] && !permissionsDeny[permission2])
                            permissions[permission2] = 0
                        else if (permissionsAllow[permission2] && !permissionsDeny[permission2])
                            permissions[permission2] = 1
                        else if (!permissionsAllow[permission2] && permissionsDeny[permission2])
                            permissions[permission2] = -1
                    }

                    for (var permission3 in permissions) {
                        if (permissions[permission3] != 0)
                            permissionsText += `${permission3} - ${permissions[permission3] == -1 ? ":red_circle:" : ":green_circle:"}\r`
                    }

                    embed
                        .addField("Permissions", permissionsText)

                    client.channels.cache.get(log.server.channels).send({ embeds: [embed] })
                    return
                }
            }

            for (var permission in Object.fromEntries(newChannel.permissionOverwrites)) {
                if (!Object.fromEntries(oldChannel.permissionOverwrites)[permission]) {
                    var permissionsText = Object.fromEntries(newChannel.permissionOverwrites)[permission].type == "member" ? `User: <@${permission}>\r` : `Role: ${client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == newChannel.guild.roles.cache.find(y => y.id == permission)?.name) ? `<@&${client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == newChannel.guild.roles.cache.find(y => y.id == permission).name).id}>` : `@${newChannel.guild.roles.cache.find(y => y.id == permission).name}`}\r`
                    permissionsText += Object.fromEntries(newChannel.permissionOverwrites)[permission].type == "member" ? `_User added_\r` : `_Role added_\r`

                    embed
                        .addField("Permissions", permissionsText)

                    client.channels.cache.get(log.server.channels).send({ embeds: [embed] })
                    return
                }
            }

            var permissionsText = logs.extra.username ? `User: ${logs.extra.toString()}\r` : `Role: ${client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == newChannel.guild.roles.cache.find(y => y.id == logs.extra.id)?.name) ? `<@&${client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == newChannel.guild.roles.cache.find(y => y.id == logs.extra.id).name).id}>` : `@${logs.extra.name}`}\r`

            var oldPermissionsAllow = Object.fromEntries(oldChannel.permissionOverwrites)[logs.extra.id]?.allow.serialize() || {}
            var oldPermissionsDeny = Object.fromEntries(oldChannel.permissionOverwrites)[logs.extra.id]?.deny.serialize() || {}

            var oldPermissions = { ...oldPermissionsAllow }
            for (var permission in oldPermissions) {
                if (!oldPermissionsAllow[permission] && !oldPermissionsDeny[permission])
                    oldPermissions[permission] = 0
                else if (oldPermissionsAllow[permission] && !oldPermissionsDeny[permission])
                    oldPermissions[permission] = 1
                else if (!oldPermissionsAllow[permission] && oldPermissionsDeny[permission])
                    oldPermissions[permission] = -1
            }

            var newPermissionsAllow = Object.fromEntries(newChannel.permissionOverwrites)[logs.extra.id]?.allow.serialize() || {}
            var newPermissionsDeny = Object.fromEntries(newChannel.permissionOverwrites)[logs.extra.id]?.deny.serialize() || {}

            var newPermissions = { ...newPermissionsAllow }
            for (var permission in newPermissions) {
                if (!newPermissionsAllow[permission] && !newPermissionsDeny[permission])
                    newPermissions[permission] = 0
                else if (newPermissionsAllow[permission] && !newPermissionsDeny[permission])
                    newPermissions[permission] = 1
                else if (!newPermissionsAllow[permission] && newPermissionsDeny[permission])
                    newPermissions[permission] = -1
            }

            var changedPermissions = {}
            for (var permission in oldPermissions) {
                if (oldPermissions[permission] != newPermissions[permission])
                    changedPermissions[permission] = [oldPermissions[permission], newPermissions[permission]]
            }

            for (var permission in changedPermissions) {
                permissionsText += `${permission} - ${changedPermissions[permission][0] == -1 ? ":red_circle:" : changedPermissions[permission][0] == 0 ? ":white_circle:" : ":green_circle:"} > ${changedPermissions[permission][1] == -1 ? ":red_circle:" : changedPermissions[permission][1] == 0 ? ":white_circle:" : ":green_circle:"}\r`
            }

            embed
                .addField("Permissions", permissionsText)

            client.channels.cache.get(log.server.channels).send({ embeds: [embed] })
        }
        else {

            const fetchedLogs = await newChannel.guild.fetchAuditLogs({
                limit: 1,
                type: 'CHANNEL_UPDATE',
            });

            const logs = fetchedLogs.entries.first();

            if (logs.executor.bot) return
            if (new Date().getTime() - logs.createdAt > 10000) return

            var embed = new Discord.MessageEmbed()
                .setTitle(":pencil: Channel updated :pencil:")
                .setColor("#fcba03")
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
                .addField("Channel", `#${newChannel.name}`)

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