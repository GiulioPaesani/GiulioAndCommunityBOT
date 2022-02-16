module.exports = {
    name: `emojiUpdate`,
    async execute(oldEmoji, newEmoji) {
        if (isMaintenance()) return

        if (newEmoji.guild.id != settings.idServer) return

        const fetchedLogs = await newEmoji.guild.fetchAuditLogs({
            limit: 1,
            type: 'EMOJI_UPDATE',
        });
        const logs = fetchedLogs.entries.first();

        if (logs.executor.bot) return
        if (new Date().getTime() - logs.createdAt > 10000) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":pencil: Emoji updated :pencil:")
            .setColor("#fcba03")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
            .addField("Emoji", newEmoji.animated ? `<a:${newEmoji.name}:${newEmoji.id}>` : `<:${newEmoji.name}:${newEmoji.id}>`)

        logs.changes.forEach(change => {
            switch (change.key) {
                case "name": change.key = "Name"; break;
            }

            embed
                .addField(change.key, `
Old: ${change.old}
New: ${change.new}
`)
        })

        client.channels.cache.get(log.server.emojiSticker).send({ embeds: [embed] })
    },
};