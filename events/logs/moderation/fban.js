module.exports = {
    name: `guildBanAdd`,
    async execute(guild, user) {
        if (isMaintenance()) return

        if (guild.id != settings.idServer) return

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });

        const logs = fetchedLogs.entries.first();
        if (!logs) return

        if (logs.executor.bot) return
        if (new Date().getTime() - logs.createdAt > 10000) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":no_entry: Forceban :no_entry:")
            .setColor("#8227cc")
            .setThumbnail(logs.target.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
            .addField(":bust_in_silhouette: Member", `${logs.target.toString()} - ID: ${logs.target.id}`, false)
            .addField("Reason", logs.reason, false)

        client.channels.cache.get(log.moderation.forceban).send({ embeds: [embed] })
    },
};