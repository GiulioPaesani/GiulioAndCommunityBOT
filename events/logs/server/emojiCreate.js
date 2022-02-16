module.exports = {
    name: `emojiCreate`,
    async execute(emoji) {
        if (isMaintenance()) return

        if (emoji.guild.id != settings.idServer) return

        const fetchedLogs = await emoji.guild.fetchAuditLogs({
            limit: 1,
            type: 'EMOJI_CREATE',
        });
        const logs = fetchedLogs.entries.first();

        if (logs.executor.bot) return
        if (new Date().getTime() - logs.createdAt > 10000) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":mouse_three_button: Emoji created :mouse_three_button:")
            .setColor("#22c90c")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
            .addField("Emoji", emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`)
            .addField("Name", emoji.name)
            .addField("ID", emoji.id)

        client.channels.cache.get(log.server.emojiSticker).send({ embeds: [embed] })
    },
};