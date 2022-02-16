module.exports = {
    name: `guildMemberUpdate`,
    async execute(oldMember, newMember) {
        if (isMaintenance()) return

        if (newMember.guild.id != settings.idServer) return

        if (oldMember._roles != newMember._roles) {
            const fetchedLogs = await newMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_ROLE_UPDATE',
            });

            const logs = fetchedLogs.entries.first();

            if (logs.executor.bot) return
            if (new Date().getTime() - logs.createdAt > 10000) return

            if (logs.changes.find(x => x.key == "$add")) {
                var roles = ""
                logs.changes.find(x => x.key == "$add").new.forEach(element => {
                    roles += `${element.name}\r`
                });

                var embed = new Discord.MessageEmbed()
                    .setTitle(":inbox_tray: Role added :inbox_tray:")
                    .setColor("#8227cc")
                    .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
                    .addField(":bust_in_silhouette: Member", `${newMember.user.toString()} - ID: ${newMember.id}`)
                    .addField("Role", roles)

                client.channels.cache.get(log.server.roles).send({ embeds: [embed] })
            }

            if (logs.changes.find(x => x.key == "$remove")) {
                var roles = ""
                logs.changes.find(x => x.key == "$remove").new.forEach(element => {
                    roles += `${element.name}\r`
                });

                var embed = new Discord.MessageEmbed()
                    .setTitle(":outbox_tray: Role removed :outbox_tray:")
                    .setColor("#8227cc")
                    .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
                    .addField(":bust_in_silhouette: Member", `${newMember.user.toString()} - ID: ${newMember.id}`)
                    .addField("Role", roles)

                client.channels.cache.get(log.server.roles).send({ embeds: [embed] })
            }
        }
    },
};