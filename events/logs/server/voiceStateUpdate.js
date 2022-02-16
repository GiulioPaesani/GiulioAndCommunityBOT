module.exports = {
    name: `voiceStateUpdate`,
    async execute(oldState, newState) {
        if (newState.guild.id != settings.idServer) return

        if (isMaintenance(newState.id)) return

        if (!oldState.channelId && newState.channelId) {

            var embed = new Discord.MessageEmbed()
                .setTitle(":inbox_tray: Member joined :inbox_tray:")
                .setColor("#22c90c")
                .setThumbnail(client.users.cache.get(newState.id).displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":bust_in_silhouette: Member", `${client.users.cache.get(newState.id).toString()} - ID: ${newState.id}`, false)
                .addField("Channel", client.channels.cache.get(newState.channelId).name ? `#${client.channels.cache.get(newState.channelId).name}` : newState.channelId)

            client.channels.cache.get(log.server.voiceChannels).send({ embeds: [embed] })
        }
        else if (oldState.channelId && !newState.channelId) {
            const fetchedLogs = await oldState.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_DISCONNECT',
            });

            const logs = fetchedLogs.entries.first();

            if (logs && logs.executor.bot) return
            if (logs && new Date().getTime() - logs.createdAt > 10000) return

            var embed = new Discord.MessageEmbed()
                .setTitle(":outbox_tray: Member disconnetted :outbox_tray:")
                .setColor("#e31705")
                .setThumbnail(client.users.cache.get(newState.id).displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)

            if (logs && logs.executor.id != oldState.id)
                embed.addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)

            embed
                .addField(":bust_in_silhouette: Member", `${client.users.cache.get(oldState.id).toString()} - ID: ${oldState.id}`, false)
                .addField("Channel", client.channels.cache.get(oldState.channelId).name ? `#${client.channels.cache.get(oldState.channelId).name}` : oldState.channelId)

            client.channels.cache.get(log.server.voiceChannels).send({ embeds: [embed] })
        }
        else {
            if (oldState.channelId != newState.channelId) {
                const fetchedLogs = await oldState.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_MOVE',
                });

                const logs = fetchedLogs.entries.first();

                if (logs && logs.executor.bot) return
                if (logs && new Date().getTime() - logs.createdAt > 10000) return

                var embed = new Discord.MessageEmbed()
                    .setTitle(":twisted_rightwards_arrows: Member moved :twisted_rightwards_arrows:")
                    .setColor("#8227cc")
                    .setThumbnail(client.users.cache.get(newState.id).displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)

                if (logs && logs.executor.id != oldState.id)
                    embed.addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)

                embed
                    .addField(":bust_in_silhouette: Member", `${client.users.cache.get(newState.id).toString()} - ID: ${newState.id}`, false)
                    .addField("From channel", client.channels.cache.get(oldState.channelId).name ? `#${client.channels.cache.get(oldState.channelId).name}` : oldState.channelId)
                    .addField("To channel", client.channels.cache.get(newState.channelId).name ? `#${client.channels.cache.get(newState.channelId).name}` : newState.channelId)

                client.channels.cache.get(log.server.voiceChannels).send({ embeds: [embed] })
            }
            else {
                const fetchedLogs = await newState.guild.fetchAuditLogs({
                    limit: 1,
                    type: 'MEMBER_UPDATE',
                });
                const logs = fetchedLogs.entries.first();

                if (logs.executor.bot) return
                if (logs && new Date().getTime() - logs.createdAt > 10000) return

                var embed = new Discord.MessageEmbed()
                    .setTitle(":loud_sound: Member state update :loud_sound:")
                    .setColor("#8227cc")
                    .setThumbnail(client.users.cache.get(newState.id).displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
                    .addField(":bust_in_silhouette: Member", `${client.users.cache.get(newState.id).toString()} - ID: ${newState.id}`, false)
                    .addField("Channel", client.channels.cache.get(newState.channelId).name ? `#${client.channels.cache.get(newState.channelId).name}` : newState.channelId)

                if (oldState.serverDeaf != newState.serverDeaf) {
                    if (oldState.serverDeaf) {
                        embed
                            .addField(":ear: Ear server", ":red_circle: > :green_circle:")
                    }
                    else {
                        embed
                            .addField(":ear: Ear server", ":green_circle: > :red_circle:")
                    }
                }
                if (oldState.serverMute != newState.serverMute) {
                    if (oldState.serverMute) {
                        embed
                            .addField(":microphone2: Mic server", ":red_circle: > :green_circle:")
                    }
                    else {
                        embed
                            .addField(":microphone2: Mic server", ":green_circle: > :red_circle:")
                    }
                }

                if (embed.fields[3])
                    client.channels.cache.get(log.server.voiceChannels).send({ embeds: [embed] })
            }
        }
    },
};