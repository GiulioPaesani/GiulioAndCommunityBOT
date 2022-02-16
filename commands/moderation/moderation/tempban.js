module.exports = {
    name: "tempban",
    aliases: [],
    onlyStaff: true,
    availableOnDM: false,
    description: "Bannare temporaneamente un utente",
    syntax: "!tempban [user] [time] (reason)",
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

        if (utenteMod(utente)) {
            return botCommandMessage(message, "NonPermesso", "", "Non puoi bannare questo utente")
        }

        if (utente.bot) {
            return botCommandMessage(message, "Warning", "Non a un bot", "Non puoi bannare un bot")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) {
            var userstats = {
                id: utente.id,
                username: utente.username || utente.user.username,
                roles: [],
                warn: [],
                moderation: {
                    "type": "",
                    "since": "",
                    "until": "",
                    "reason": "",
                    "moderator": "",
                    "ticketOpened": false
                }
            }

            database.collection("userstats").insertOne(userstats);
            userstatsList.push(userstats)
        }

        var reason = args.slice(2).join(" ");
        if (!reason) {
            reason = "Nessun motivo";
        }

        var time = args[1];
        if (!time) {
            return botCommandMessage(message, "Error", "Inserire un tempo", "Scrivi il tempo del tempban", property)
        }
        time = ms(time)
        if (!time) {
            return botCommandMessage(message, "Error", "Tempo non valido", "Hai inserito un tempo non valido", property)
        }

        var button1 = new Discord.MessageButton()
            .setLabel("Sovrascrivi moderazione (Tempban)")
            .setStyle("DANGER")
            .setCustomId(`tban,${message.author.id},${utente.id},${reason.replace(eval(`/,/g`), "").slice(0, 43)},${time}`)

        var row = new Discord.MessageActionRow()
            .addComponents(button1)

        if (userstats.moderation.type == "Muted") {
            return botCommandMessage(message, "Warning", "Utente mutato", "", null, [{
                name: ":sound: MUTED", value: `
**Reason**
${userstats.moderation.reason}
**Since**
${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})
**Moderator**
${userstats.moderation.moderator}           
`}], row)
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
`}], row)
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
`}], row)
        }
        if (userstats.moderation.type == "Tempbanned") {
            return botCommandMessage(message, "Warning", "Utente già tempbannato", "", null, [{
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
`}], row)
        }

        if (message.guild.members.cache.find(x => x.id == utente.id)) {
            var ruoloTempbanned = message.guild.roles.cache.find(role => role.id == settings.ruoliModeration.tempbanned)
            message.guild.channels.cache.forEach((canale) => {
                if (canale.parentId != settings.idCanaliServer.categoriaModerationTicket && canale.id != settings.idCanaliServer.rules) {
                    canale.permissionOverwrites.edit(ruoloTempbanned, {
                        VIEW_CHANNEL: false,
                        SPEAK: false
                    })
                }
            })

            utente.roles.add(ruoloTempbanned)
                .then(() => {
                    if (utente.voice?.channel) {
                        utente.voice.kick();
                    }
                })
        }
        else {
            userstats.roles.push(settings.ruoliModeration.tempbanned)
        }

        userstats.moderation = {
            "type": "Tempbanned",
            "since": new Date().getTime(),
            "until": moment(new Date().getTime()).add(time, "ms").valueOf(),
            "reason": reason,
            "moderator": message.author.username,
            "ticketOpened": false
        }

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

        if (utente.user) utente = utente.user

        var embed = new Discord.MessageEmbed()
            .setAuthor("[TEMPBAN] " + utente.tag, utente.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://i.postimg.cc/j56K5XKC/Ban.png")
            .setColor("#6143CB")
            .addField("Reason", reason)
            .addField("Time", ms(time, { long: true }))
            .addField("Moderator", message.author.toString())
            .setFooter("User ID: " + utente.id)

        message.channel.send({ embeds: [embed] })
            .then(msg => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(":o: Tempban :o:")
                    .setColor("#8227cc")
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${message.author.toString()} - ID: ${message.author.id}`, false)
                    .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`, false)
                    .addField("Duration", `${ms(time, { long: true })} (Until: ${moment(new Date().getTime()).add(time, "ms").format("ddd DD MMM YYYY, HH:mm:ss")})`, false)
                    .addField("Reason", reason, false)

                if (!isMaintenance())
                    client.channels.cache.get(log.moderation.tempban).send({ embeds: [embed] })
            })

        var embed = new Discord.MessageEmbed()
            .setTitle("Sei stato bannato temporaneamente")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/j56K5XKC/Ban.png")
            .addField("Reason", reason)
            .addField("Time", ms(time, { long: true }))
            .addField("Moderator", message.author.toString())

        utente.send({ embeds: [embed] })
            .catch(() => { })
    },
};
