module.exports = {
    name: `inviteDelete`,
    async execute(invite) {
        if (invite.guild.id != settings.idServer) return

        invites.get(invite.guild.id).delete(invite.code);

        if (isMaintenance()) return

        const fetchedLogs = await invite.guild.fetchAuditLogs({
            limit: 1,
            type: 'INVITE_DELETE',
        });
        const logs = fetchedLogs.entries.first();

        if (logs.executor.bot) return
        if (new Date().getTime() - logs.createdAt > 10000) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":wastebasket: Invite deleted :wastebasket:")
            .setColor("#e31705")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
            .addField(":bust_in_silhouette: Inviter", `${client.users.cache.get(logs.changes.find(x => x.key == "inviter_id").old).toString()} - ID: ${client.users.cache.get(logs.changes.find(x => x.key == "inviter_id").old).id}`, false)
            .addField("Code", logs.changes.find(x => x.key == "code").old, false)
            .addField("Max uses", logs.changes.find(x => x.key == "max_uses").old == 0 ? "∞" : logs.changes.find(x => x.key == "max_uses").old, false)
            .addField("Expire time", logs.changes.find(x => x.key == "max_age").old == 0 ? "Never" : ms(logs.changes.find(x => x.key == "max_age").old * 1000, { long: true }), false)
            .addField("Temponary", logs.changes.find(x => x.key == "temporary").old ? "Yes" : "No", false)
            .addField("Channel", invite.channel.toString(), false)

        client.channels.cache.get(log.server.invites).send({ embeds: [embed] })
    },
};