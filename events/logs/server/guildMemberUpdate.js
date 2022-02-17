module.exports = {
    name: `guildMemberUpdate`,
    async execute(oldMember, newMember) {
        if (newMember.guild.id != settings.idServer) return

        if (isMaintenance(newMember.user.id)) return

        if (!oldMember.nickname && newMember.nickname) {

            const fetchedLogs = await newMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_UPDATE',
            });

            const logs = fetchedLogs.entries.first();
            if (new Date().getTime() - logs.createdAt > 10000) return

            var embed = new Discord.MessageEmbed()
                .setTitle(":inbox_tray: Nickname setted :inbox_tray:")
                .setColor("#22c90c")
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)

            if (logs.executor.id != newMember.id)
                embed
                    .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)

            embed
                .addField(":bust_in_silhouette: Member", `${newMember.toString()} - ID: ${newMember.id}`, false)
                .addField("Nickname", `Old: _Null_\rNew: ${newMember.nickname}`)

            if (!isMaintenance())
                client.channels.cache.get(log.server.membersPresence).send({ embeds: [embed] })

            if (logs.executor.id == newMember.id) return

            var embed = new Discord.MessageEmbed()
                .setTitle(":green_circle: Nickname inserito :green_circle:")
                .setColor("#22c90c")
                .setThumbnail("https://i.postimg.cc/d3JsqwyP/Nickname.png")
                .setDescription(`${logs.executor.toString()} ti ha inserito un **nickname** nel server`)
                .addField(":placard: Nickname", `\`\`\`${newMember.nickname}\`\`\``)

            client.users.cache.get(newMember.id).send({ embeds: [embed] })
                .catch(() => { })
        }
        else if (oldMember.nickname && !newMember.nickname) {

            const fetchedLogs = await newMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_UPDATE',
            });

            const logs = fetchedLogs.entries.first();
            if (new Date().getTime() - logs.createdAt > 10000) return

            var embed = new Discord.MessageEmbed()
                .setTitle(":outbox_tray: Nickname removed :outbox_tray:")
                .setColor("#e31705")
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)

            if (logs.executor.id != newMember.id)
                embed
                    .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)

            embed
                .addField(":bust_in_silhouette: Member", `${newMember.toString()} - ID: ${newMember.id}`, false)
                .addField("Nickname", `Old: ${oldMember.nickname}\rNew: _Null_`)

            if (!isMaintenance())
                client.channels.cache.get(log.server.membersPresence).send({ embeds: [embed] })

            if (logs.executor.id == newMember.id) return

            var embed = new Discord.MessageEmbed()
                .setTitle(":red_circle: Nickname resettato :red_circle:")
                .setColor("#e31705")
                .setThumbnail("https://i.postimg.cc/d3JsqwyP/Nickname.png")
                .setDescription(`${logs.executor.toString()} ha resettato il tuo **nickname** nel server`)
                .addField(":placard: Old Nickname", `\`\`\`${oldMember.nickname}\`\`\``)

            client.users.cache.get(newMember.id).send({ embeds: [embed] })
                .catch(() => { })
        }
        else if (newMember.nickname && oldMember.nickname != newMember.nickname) {

            const fetchedLogs = await newMember.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_UPDATE',
            });

            const logs = fetchedLogs.entries.first();
            if (new Date().getTime() - logs.createdAt > 10000) return

            var embed = new Discord.MessageEmbed()
                .setTitle(":pencil: Nickname updated :pencil:")
                .setColor("#fcba03")
                .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)

            if (logs.executor.id != newMember.id)
                embed
                    .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)

            embed
                .addField(":bust_in_silhouette: Member", `${newMember.toString()} - ID: ${newMember.id}`, false)
                .addField("Nickname", `Old: ${oldMember.nickname}\rNew: ${newMember.nickname}`)

            if (!isMaintenance())
                client.channels.cache.get(log.server.membersPresence).send({ embeds: [embed] })

            if (logs.executor.id == newMember.id) return

            var embed = new Discord.MessageEmbed()
                .setTitle(":yellow_circle: Nickname cambiato :yellow_circle:")
                .setColor("#fcba03")
                .setThumbnail("https://i.postimg.cc/d3JsqwyP/Nickname.png")
                .setDescription(`${logs.executor.toString()} ti ha cambiato il tuo **nickname** nel server`)
                .addField(":placard: New Nickname", `\`\`\`${newMember.nickname}\`\`\``)

            client.users.cache.get(newMember.id).send({ embeds: [embed] })
                .catch(() => { })
        }
    },
};