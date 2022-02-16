module.exports = {
    name: `roleUpdate`,
    async execute(oldRole, newRole) {
        if (isMaintenance()) return

        if (newRole.guild.id != settings.idServer) return

        const fetchedLogs = await newRole.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_UPDATE',
        });

        const logs = fetchedLogs.entries.first();

        if (logs.executor.bot) return
        if (new Date().getTime() - logs.createdAt > 10000) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":pencil: Role updated :pencil:")
            .setColor("#fcba03")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
            .addField("Role", oldRole.name)

        logs.changes.forEach(change => {
            if (!change.key.startsWith("permissions")) {
                switch (change.key) {
                    case "color": change.old = toHex(change.old); change.new = toHex(change.new); break;
                }

                switch (change.key) {
                    case "color": change.key = "Color"; break;
                    case "hoist": change.key = "Separated"; break;
                    case "mentionable": change.key = "Mentionable"; break;
                    case "position": change.key = "Position"; break;
                    case "rate_limit_per_user": change.key = "Slowmode"; break;
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
            var permissions = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"]
            permissionsText = ""

            var oldPermissions = {}
            var newPermissions = {}

            permissions.forEach(permission => {
                oldPermissions[permission] = oldRole.permissions.has(permission)
                newPermissions[permission] = newRole.permissions.has(permission)
            })

            var changedPermissions = {}
            for (var permission in oldPermissions) {
                if (oldPermissions[permission] != newPermissions[permission])
                    changedPermissions[permission] = [oldPermissions[permission], newPermissions[permission]]
            }

            for (var permission in changedPermissions) {
                permissionsText += `${permission} - ${!changedPermissions[permission][0] ? ":red_circle:" : ":green_circle:"} > ${!changedPermissions[permission][1] ? ":red_circle:" : ":green_circle:"}\r`
            }

            if (permissionsText != "")
                embed
                    .addField("Permissions", permissionsText)
        }

        client.channels.cache.get(log.server.roles).send({ embeds: [embed] })
    },
};