module.exports = {
    name: `guildMemberRemove`,
    async execute(member) {
        if (isMaintenance(member.user.id)) return

        if (member.user.bot) return
        if (member.guild.id != settings.idServer) return

        if (member.roles.cache.has(settings.idRuoloNonVerificato)) return

        var userstats = userstatsList.find(x => x.id == member.id)
        if (!userstats) return

        userstats.roles = member._roles;
        userstats.leavedAt = new Date().getTime();
        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

        var roles = ""
        member._roles.forEach(role => {
            roles += `${client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == member.guild.roles.cache.find(y => y.id == role)?.name) ? client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == member.guild.roles.cache.find(y => y.id == role).name).toString() : member.guild.roles.cache.find(y => y.id == role).toString()}\r`
        })
        if (roles == "")
            roles = "_Nessun ruolo_"

        var embed = new Discord.MessageEmbed()
            .setTitle(":outbox_tray: Goodbye :outbox_tray:")
            .setColor("#e31705")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":bust_in_silhouette: Member", `${member.toString()} - ID: ${member.id}`, false)
            .addField("Joined server", `${moment(member.joinedTimestamp).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(member.joinedTimestamp).fromNow()})`, false)
            .addField("Roles", roles, false)

        if (!isMaintenance())
            client.channels.cache.get(log.server.welcomeGoodbye).send({ embeds: [embed] })
    },
};
