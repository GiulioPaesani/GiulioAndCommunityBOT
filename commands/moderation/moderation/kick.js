module.exports = {
    name: "kick",
    aliases: [],
    onlyStaff: true,
    availableOnDM: false,
    description: "Espelle un utente dal server",
    syntax: "!kick [user] (reason)",
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
            return botCommandMessage(message, "NonPermesso", "", "Non puoi espellere questo utente")
        }

        if (utente.bot) {
            return botCommandMessage(message, "Warning", "Non a un bot", "Non puoi espellere un bot")
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return botCommandMessage(message, "Error", "Utente non in memoria", "Questo utente non è presente nei dati del bot", property)

        var reason = args.slice(1).join(" ");

        if (!reason) {
            reason = "Nessun motivo";
        }

        var button1 = new Discord.MessageButton()
            .setLabel("Sovrascrivi moderazione (Kick)")
            .setStyle("DANGER")
            .setCustomId(`kick,${message.author.id},${utente.id},${reason.replace(eval(`/,/g`), "").slice(0, 57)}`)

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
`}], row)
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

        var embed = new Discord.MessageEmbed()
            .setAuthor("[KICK] " + utente.user.tag, utente.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://i.postimg.cc/6QvBsKmr/Kick.png")
            .setColor("#6143CB")
            .addField("Reason", reason)
            .addField("Moderator", message.author.toString())
            .setFooter("User ID: " + utente.user.id)

        message.channel.send({ embeds: [embed] })
            .then(msg => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(":ping_pong: Kick :ping_pong:")
                    .setColor("#8227cc")
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(utente.user.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${message.author.toString()} - ID: ${message.author.id}`, false)
                    .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`, false)
                    .addField("Reason", reason, false)

                if (!isMaintenance())
                    client.channels.cache.get(log.moderation.kick).send({ embeds: [embed] })
            })

        var embed = new Discord.MessageEmbed()
            .setTitle("Sei stato espulso")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/6QvBsKmr/Kick.png")
            .addField("Reason", reason)
            .addField("Moderator", message.author.toString())

        utente.send({ embeds: [embed] })
            .then(() => {
                utente.kick({ reason: reason })
            })
            .catch(() => { })
    },
};
