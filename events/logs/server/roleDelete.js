module.exports = {
    name: `roleDelete`,
    async execute(role) {
        if (isMaintenance()) return

        if (role.guild.id != settings.idServer) return

        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_DELETE',
        });
        const logs = fetchedLogs.entries.first();

        if (logs.executor.bot) return
        if (new Date().getTime() - logs.createdAt > 10000) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":wastebasket: Role deleted :wastebasket:")
            .setColor("#e31705")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
            .addField("Role", role.name)
            .addField("Color", toHex(role.color))

        var permissions = ["CREATE_INSTANT_INVITE", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MANAGE_GUILD", "ADD_REACTIONS", "VIEW_AUDIT_LOG", "PRIORITY_SPEAKER", "STREAM", "VIEW_CHANNEL", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "VIEW_GUILD_INSIGHTS", "CONNECT", "SPEAK", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_EMOJIS"]
        permissionsText = ""

        permissions.forEach(permission => {
            if (role.permissions.has(permission)) {
                permissionsText += `${permission}\r`
            }
        })

        if (permissionsText != "")
            embed
                .addField("Permissions", permissionsText)

        client.channels.cache.get(log.server.roles).send({ embeds: [embed] })
    },
};