module.exports = {
    name: "unmute",
    aliases: [],
    onlyStaff: true,
    availableOnDM: false,
    description: "Smutare un utente",
    syntax: "!unmute [user]",
    category: "moderation",
    channelsGranted: [],
    async execute(message, args, client, property) {
        var utente = message.mentions.members?.first()
        if (!utente) {
            var utente = await getUser(args[0])
        }

        if (!utente) {
            return botCommandMessage(message, "Error", "Utente non trovato o non valido", "Hai inserito un utente non disponibile o non valido", property)
        }

        if (utente.bot) {
            return botCommandMessage(message, "Warning", "Non a un bot", "Non puoi smutare un bot")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        if (userstats.moderation.type == "") {
            return botCommandMessage(message, "Error", "Utente non mutato", "Questo utente non è mutato", property)
        }

        if (userstats.moderation.type == "Banned") {
            return botCommandMessage(message, "Warning", "Utente bannato", "", null, [{
                name: ":speaker: BANNED", value: `
**Reason**
${userstats.moderation.reason}
**Since**
${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})
**Moderator**
${userstats.moderation.moderator}           
`}])
        }
        if (userstats.moderation.type == "Tempbanned") {
            return botCommandMessage(message, "Warning", "Utente tempbannato", "", null, [{
                name: ":speaker: TEMPBANNED", value: `
**Reason**
${userstats.moderation.reason}
**Since**
${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})
**Until**
${moment(userstats.moderation.until).format("ddd DD MMM, HH:mm")} (in ${moment(userstats.moderation.until).toNow(true)})
**Moderator**
${userstats.moderation.moderator}           
`}])
        }
        if (userstats.moderation.type == "ForceBanned") {
            return botCommandMessage(message, "Warning", "Utente bannato forzatamente", "", null, [{
                name: ":mute: FORCEBANNED", value: `
**Reason**
${userstats.moderation.reason}
**Since**
${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})
**Moderator**
${userstats.moderation.moderator}           
`}])
        }

        if (message.guild.members.cache.find(x => x.id == utente.id)) {
            utente.roles.remove(settings.ruoliModeration.muted);
            utente.roles.remove(settings.ruoliModeration.tempmuted)
                .then(() => {
                    if (utente.voice?.channel) {
                        var canale = utente.voice.channelId
                        if (canale == settings.idCanaliServer.general1)
                            utente.voice.setChannel(settings.idCanaliServer.general2)
                        else
                            utente.voice.setChannel(settings.idCanaliServer.general1)
                        utente.voice.setChannel(canale)
                    }
                })
        }
        else {
            userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.muted)
            userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.tempmuted)
        }

        if (utente.user) utente = utente.user

        var embed = new Discord.MessageEmbed()
            .setAuthor("[UNMUTE] " + utente.tag, utente.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://i.postimg.cc/gjYp6Zks/Mute.png")
            .setColor("#6143CB")
            .addField("Moderator", message.author.toString())
            .addField("Time muted", ms(new Date().getTime() - userstats.moderation.since, { long: true }))
            .setFooter("User ID: " + utente.id)

        await message.channel.send({ embeds: [embed] })
            .then(msg => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(":loud_sound: Unmute :loud_sound:")
                    .setColor("#8227cc")
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${message.author.toString()} - ID: ${message.author.id}`, false)
                    .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`, false)
                    .addField("Duration", `${ms(new Date().getTime() - userstats.moderation.since, { long: true })} (Since: ${moment(userstats.moderation.since).format("ddd DD MMM YYYY, HH:mm:ss")})`, false)
                    .addField("Reason", userstats.moderation.reason || "_Null_", false)

                if (!isMaintenance())
                    client.channels.cache.get(log.moderation.unmute).send({ embeds: [embed] })
            })

        var embed = new Discord.MessageEmbed()
            .setTitle("Sei stato smutato")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/gjYp6Zks/Mute.png")
            .addField("Moderator", message.author.toString())
            .addField("Time muted", ms(userstats.moderation.until - userstats.moderation.since, { long: true }))

        utente.send({ embeds: [embed] })
            .catch(() => { })

        userstats.moderation = {
            "type": "",
            "since": "",
            "until": "",
            "reason": "",
            "moderator": "",
            "ticketOpened": false
        }

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
    },
};
