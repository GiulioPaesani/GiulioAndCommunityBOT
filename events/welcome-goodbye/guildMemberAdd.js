module.exports = {
    name: `guildMemberAdd`,
    async execute(member) {
        if (isMaintenance(member.user.id)) return

        if (member.user.bot) return
        if (member.guild.id != settings.idServer) return

        member.guild.invites.fetch().then(guildInvites => {
            invites[member.guild.id] = guildInvites;
        })

        if (!userstatsList.find(x => x.id == member.id) || (userstatsList.find(x => x.id == member.id) && !userstatsList.find(x => x.id == member.id).joinedAt)) {
            member.roles.add(settings.idRuoloNonVerificato)
            client.channels.cache.get(settings.idCanaliServer.joinTheServer).send(member.toString())
                .then(msg => msg.delete().catch(() => { }))
            return
        }

        var userstats = userstatsList.find(x => x.id == member.id)

        var roles = ""
        userstats.roles.forEach(role => {
            roles += `${client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == member.guild.roles.cache.find(y => y.id == role)?.name) ? client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == member.guild.roles.cache.find(y => y.id == role)?.name).toString() : member.guild.roles.cache.find(y => y.id == role).toString()}\r`
        })
        if (roles == "")
            roles = "_Nessun ruolo_"

        member.guild.invites.fetch().then(guildInvites => {
            const ei = invites.get(member.guild.id);
            const invite = guildInvites.find(i => Object.fromEntries(ei)[i.code] < i.uses);

            var embed = new Discord.MessageEmbed()
                .setTitle(":inbox_tray: Welcome back :inbox_tray:")
                .setColor("#22c90c")
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":bust_in_silhouette: Member", `${member.toString()} - ID: ${member.id}`, false)
                .addField("Account created", `${moment(member.user.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(member.user.createdAt).fromNow()})`, false)
                .addField("Leaved server", `${moment(userstats.leavedAt).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(userstats.leavedAt).fromNow()})`, false)

            if (invite)
                embed.addField("Invite", `${invite.code} - Created from: ${client.users.cache.get(invite.inviter.id).toString()} (${invite.uses} uses)`, false)

            embed.addField("Roles", roles, false)

            if (!isMaintenance())
                client.channels.cache.get(log.server.welcomeGoodbye).send({ embeds: [embed] })

            userstats.leavedAt = null

            var elencoRuoli = "";
            if (userstats.roles.length != 0) {

                for (var i = 0; i < userstats.roles.length; i++) {
                    if (member.guild.roles.cache.get(userstats.roles[i]))
                        elencoRuoli += `- @${member.guild.roles.cache.get(userstats.roles[i]).name}\r`;
                    member.roles.add(userstats.roles[i])
                        .catch(() => { })
                }

                userstats.roles = [];
                userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
            }

            var embed = new Discord.MessageEmbed()
                .setTitle(`:wave: Bentornato ${member.user.username}`)
                .setColor("#42A9F6")
                .setImage("https://i.postimg.cc/MZ45kGMN/Banner2.jpg")
                .setDescription(`Ciao, bentornato all'interno del server **GiulioAndCommunity**. In questo server potrai **parlare** e** divertirti** con tantissimi utenti tutti i giorni
Prima di partecipare al server leggi nuovamente tutte le <#${settings.idCanaliServer.rules}> da rispettare e tutte le <#${settings.idCanaliServer.info}> sui tantissimi **comandi**, **funzioni** e canali nel server
`)
            if (elencoRuoli != "")
                embed.addField(":shirt: I tuoi ruoli", `
Prima di uscire dal server avevi dei ruoli, ecco che ti sono stati ridati:
${elencoRuoli}`)

            member.send({ embeds: [embed] })
                .catch(() => { })
        })
    },
};
