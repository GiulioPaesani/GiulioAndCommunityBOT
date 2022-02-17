module.exports = {
    name: `channelCreate`,
    async execute(channel) {
        if (isMaintenance()) return

        if (channel.guild?.id != settings.idServer) return

        if (!channel.guild) return

        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_CREATE',
        });
        const logs = fetchedLogs.entries.first();

        if (logs.executor.bot) return

        if (new Date().getTime() - logs.createdAt > 10000) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":mouse_three_button: Channel created :mouse_three_button:")
            .setColor("#22c90c")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
            .addField("Channel", "#" + channel.name)
            .addField("Category", channel.parentId ? channel.parent.toString() : "_Null_")
            .addField("Type", channel.type == "GUILD_TEXT" ? "Text" : channel.type == "GUILD_VOICE" ? "GUILD_VOICE" : channel.type)

        var permissionsText = ""
        for (var permission in Object.fromEntries(channel.permissionOverwrites)) {
            permissionsText += Object.fromEntries(channel.permissionOverwrites)[permission].type == "member" ? `User: <@${permission}>\r` : `Role: ${client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == channel.guild.roles.cache.find(y => y.id == permission)?.name) ? client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == channel.guild.roles.cache.find(y => y.id == permission).name).toString() : channel.guild.roles.cache.find(y => y.id == permission).name}\r`

            var permissionsAllow = Object.fromEntries(channel.permissionOverwrites)[permission]?.allow.serialize() || {}
            var permissionsDeny = Object.fromEntries(channel.permissionOverwrites)[permission]?.deny.serialize() || {}

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
        }

        if (permissionsText != "")
            embed.addField("Permissions", permissionsText)

        client.channels.cache.get(log.server.channels).send({ embeds: [embed] })
    },
};