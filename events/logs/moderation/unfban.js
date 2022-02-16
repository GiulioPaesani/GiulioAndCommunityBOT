module.exports = {
    name: `guildBanRemove`,
    async execute(guild, user) {
        if (isMaintenance()) return

        if (guild.id != settings.idServer) return

        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_REMOVE',
        });

        const logs = fetchedLogs.entries.first();
        if (!logs) return
        if (logs.executor.bot) return
        if (new Date().getTime() - logs.createdAt > 10000) return

        var userstats = userstatsList.find(x => x.id == logs.target.id);

        var embed = new Discord.MessageEmbed()
            .setTitle(":name_badge: Unban :name_badge:")
            .setColor("#8227cc")
            .setThumbnail(logs.target.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
            .addField(":bust_in_silhouette: Member", `${logs.target.toString()} - ID: ${logs.target.id}`, false)

        if (userstats.moderation.type != "") {
            embed
                .addField("Duration", `${ms(new Date().getTime() - userstats.moderation.since, { long: true })} (Since: ${moment(userstats.moderation.since).format("ddd DD MMM YYYY, HH:mm:ss")})`, false)
                .addField("Reason", userstats.moderation.reason || "_Null_", false)

            userstatsList[userstatsList.findIndex(x => x.id == userstats.id)].moderation = {
                "type": "",
                "since": "",
                "until": "",
                "reason": "",
                "moderator": "",
                "ticketOpened": false
            }
        }

        client.channels.cache.get(log.moderation.unban).send({ embeds: [embed] })
    },
};