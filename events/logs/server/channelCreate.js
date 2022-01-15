module.exports = {
    name: `channelCreate`,
    async execute(channel) {
        if (isMaintenance()) return

        if (channel.guild.id != settings.idServer) return

        if (!channel.guild) return

        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_CREATE',
        });
        const logs = fetchedLogs.entries.first();

        if (logs.executor.bot) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":mouse_three_button: Channel created :mouse_three_button:")
            .setColor("#22c90c")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
            .addField("Channel", "#" + channel.name)
            .addField("Category", channel.parentID ? channel.parent : "_Null_")
            .addField("Type", channel.type == "text" ? "Text" : channel.type == "voice" ? "Voice" : channel.type)

        if (channel.permissionOverwrites.array().length != 0) {
            var permissionText
            if (channel.permissionOverwrites.array().find(x => x.id == channel.guild.roles.everyone.id)) {
                if (channel.permissionOverwrites.array().length == 1) {
                    permissionText = "_Private for @everyone_"
                }
                else {
                    permissionText = "_Accessible only for_\r"
                    channel.permissionOverwrites.array().filter(x => x.id != channel.guild.roles.everyone.id).forEach(permission => {
                        permissionText += permission.type == "member" ? `<@${permission.id}>\r` : `${client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == channel.guild.roles.cache.find(y => y.id == permission.id).name).toString()}\r`
                    })
                }
            }

            embed
                .addField("Permissions", permissionText)
        }

        client.channels.cache.get(log.server.channels).send(embed)
    },
};