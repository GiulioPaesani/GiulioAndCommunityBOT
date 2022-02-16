module.exports = {
    name: `inviteCreate`,
    async execute(invite) {
        if (invite.guild.id != settings.idServer) return

        invites.get(invite.guild.id).set(invite.code, invite.uses);

        if (isMaintenance()) return

        const fetchedLogs = await invite.guild.fetchAuditLogs({
            limit: 1,
            type: 'INVITE_CREATE',
        });
        const logs = fetchedLogs.entries.first();

        if (logs.executor.bot) return
        if (new Date().getTime() - logs.createdAt > 10000) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":mouse_three_button: Invite created :mouse_three_button:")
            .setColor("#22c90c")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":bust_in_silhouette: Inviter", `${invite.inviter.toString()} - ID: ${invite.inviter.id}`, false)
            .addField("Code", invite.code, false)
            .addField("Max uses", invite.maxUses == 0 ? "∞" : invite.maxUses, false)
            .addField("Expire time", invite.maxAge == 0 ? "Never" : ms(invite.maxAge * 1000, { long: true }), false)
            .addField("Temponary", invite.temporary ? "Yes" : "No", false)
            .addField("Channel", invite.channel.toString(), false)

        client.channels.cache.get(log.server.invites).send({ embeds: [embed] })
    },
};