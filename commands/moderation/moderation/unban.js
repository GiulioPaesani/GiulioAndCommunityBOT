module.exports = {
    name: "unban",
    aliases: [],
    onlyStaff: true,
    availableOnDM: false,
    description: "Sbannare un utente",
    syntax: "!unban [user]",
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
            return botCommandMessage(message, "Warning", "Non a un bot", "Non puoi sbannare un bot")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        if (userstats.moderation.type == "") {
            return botCommandMessage(message, "Warning", "Utente non bannato", "Questo utente non è bannato", property)
        }

        if (userstats.moderation.type == "Muted") {
            return botCommandMessage(message, "Warning", "Utente mutato", "", null, [{
                name: ":sound: MUTED", value: `
**Reason**
${userstats.moderation.reason}
**Since**
${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})
**Moderator**
${userstats.moderation.moderator}           
`}])
        }
        if (userstats.moderation.type == "Tempmuted") {
            return botCommandMessage(message, "Warning", "Utente tempmutato", "", null, [{
                name: ":sound: TEMPMUTED", value: `
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

        if (message.guild.members.cache.find(x => x.id == utente.id)) {
            message.guild.members.unban(utente.id).catch(() => { })

            utente.roles.remove(settings.ruoliModeration.banned)
            utente.roles.remove(settings.ruoliModeration.tempbanned)
        }
        else {
            userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.banned)
            userstats.roles = userstats.roles.filter(x => x != settings.ruoliModeration.tempbanned)
        }

        if (utente.user) utente = utente.user

        var embed = new Discord.MessageEmbed()
            .setAuthor("[UNBAN] " + utente.tag, utente.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://i.postimg.cc/j56K5XKC/Ban.png")
            .setColor("#6143CB")
            .addField("Moderator", message.author.toString())
            .addField("Time banned", ms(new Date().getTime() - userstats.moderation.since, { long: true }))
            .setFooter("User ID: " + utente.id)

        await message.channel.send({ embeds: [embed] })
            .then(msg => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(":name_badge: Unban :name_badge:")
                    .setColor("#8227cc")
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${message.author.toString()} - ID: ${message.author.id}`, false)
                    .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`, false)
                    .addField("Duration", `${ms(new Date().getTime() - userstats.moderation.since, { long: true })} (Since: ${moment(userstats.moderation.since).format("ddd DD MMM YYYY, HH:mm:ss")})`, false)
                    .addField("Reason", userstats.moderation.reason || "_Null_", false)

                if (!isMaintenance())
                    client.channels.cache.get(log.moderation.unban).send({ embeds: [embed] })
            })

        var embed = new Discord.MessageEmbed()
            .setTitle("Sei stato sbannato")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/j56K5XKC/Ban.png")
            .addField("Moderator", message.author.toString())
            .addField("Time banned", ms(new Date().getTime() - userstats.moderation.since, { long: true }))

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
