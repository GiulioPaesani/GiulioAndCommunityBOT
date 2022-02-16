module.exports = {
    name: `roleCreate`,
    async execute(role) {
        if (isMaintenance()) return

        if (role.guild.id != settings.idServer) return

        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_CREATE',
        });
        const logs = fetchedLogs.entries.first();

        if (logs.executor.bot) return
        if (new Date().getTime() - logs.createdAt > 10000) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":mouse_three_button: Role created :mouse_three_button:")
            .setColor("#22c90c")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
            .addField("Role", role.name)

        client.channels.cache.get(log.server.roles).send({ embeds: [embed] })
    },
};