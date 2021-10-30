module.exports = {
    name: "tempmute",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {
        var utente = message.mentions.members.first()
        if (!utente) {
            var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args[0]) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args[0]) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args[0])
        }

        if (!utente) {
            error(message, "Utente non trovato", "`!tempmute [user] [time] (reason))`")
            return
        }

        if (utenteMod(utente)) {
            var embed = new Discord.MessageEmbed()
                .setTitle("Non hai il permesso")
                .setColor("#9E005D")
                .setDescription("Non puoi mutare questo utente")

            var data = new Date()
            if ((data.getMonth() == 9 && data.getDate() == 31) || (data.getMonth() == 10 && data.getDate() == 1)) {
                embed.setThumbnail("https://i.postimg.cc/W3b7rxMp/Not-Allowed-Halloween.png")
            }
            else {
                embed.setThumbnail("https://i.postimg.cc/D0scZ1XW/No-permesso.png")
            }

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 7000 })
                    .catch(() => { })
                msg.delete({ timeout: 7000 })
                    .catch(() => { })
            })
            return
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return

        var reason = args.slice(2).join(" ");

        if (!reason) {
            reason = "Nessun motivo";
        }

        if (userstats.moderation.type == "Muted") {
            var embed = new Discord.MessageEmbed()
                .setTitle("Utente già mutato")
                .setDescription("Questo utente è gia mutato")
                .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                .setColor("#8F8F8F")
                .addField(":scroll: Reason", userstats.moderation.reason)
                .addField(":flag_white: Since", `${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})`)
                .addField(":bust_in_silhouette: Moderator", `${userstats.moderation.moderator.toString()}`)

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 20000 })
                    .catch(() => { })
                msg.delete({ timeout: 20000 })
                    .catch(() => { })
            })
            return
        }
        if (userstats.moderation.type == "Tempmuted") {
            var embed = new Discord.MessageEmbed()
                .setTitle("Utente già tempmutato")
                .setDescription("Questo utente è gia mutato")
                .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                .setColor("#8F8F8F")
                .addField(":scroll: Reason", userstats.moderation.reason)
                .addField(":flag_white: Since", `${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})`)
                .addField(":checkered_flag: Until", `${moment(userstats.moderation.until).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.until).toNow(true)})`)
                .addField(":bust_in_silhouette: Moderator", `${userstats.moderation.moderator.toString()}`)

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 20000 })
                    .catch(() => { })
                msg.delete({ timeout: 20000 })
                    .catch(() => { })
            })
            return
        }
        if (userstats.moderation.type == "Banned") {
            var embed = new Discord.MessageEmbed()
                .setTitle("Utente bannato")
                .setDescription("Questo utente è bannato")
                .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                .setColor("#8F8F8F")
                .addField(":scroll: Reason", userstats.moderation.reason)
                .addField(":flag_white: Since", `${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})`)
                .addField(":bust_in_silhouette: Moderator", `${userstats.moderation.moderator.toString()}`)

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 20000 })
                    .catch(() => { })
                msg.delete({ timeout: 20000 })
                    .catch(() => { })
            })
            return
        }
        if (userstats.moderation.type == "Tempbanned") {
            var embed = new Discord.MessageEmbed()
                .setTitle("Utente tempbannato")
                .setDescription("Questo utente è bannato")
                .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                .setColor("#8F8F8F")
                .addField(":scroll: Reason", userstats.moderation.reason)
                .addField(":flag_white: Since", `${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})`)
                .addField(":checkered_flag: Until", `${moment(userstats.moderation.until).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.until).toNow(true)})`)
                .addField(":bust_in_silhouette: Moderator", `${userstats.moderation.moderator.toString()}`)

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 20000 })
                    .catch(() => { })
                msg.delete({ timeout: 20000 })
                    .catch(() => { })
            })
            return
        }
        if (userstats.moderation.type == "ForceBanned") {
            var embed = new Discord.MessageEmbed()
                .setTitle("Utente bannato forzatamente")
                .setDescription("Questo utente è bannato")
                .setThumbnail("https://i.postimg.cc/JnJw1q5M/Giulio-Sad.png")
                .setColor("#8F8F8F")
                .addField(":scroll: Reason", userstats.moderation.reason)
                .addField(":flag_white: Since", `${moment(userstats.moderation.since).format("ddd DD MMM, HH:mm")} (${moment(userstats.moderation.since).fromNow()})`)
                .addField(":bust_in_silhouette: Moderator", `${userstats.moderation.moderator.toString()}`)

            message.channel.send(embed).then(msg => {
                message.delete({ timeout: 20000 })
                    .catch(() => { })
                msg.delete({ timeout: 20000 })
                    .catch(() => { })
            })
            return
        }

        var time = args[1];
        if (!time) {
            error(message, "Inserire un tempo", "`!tempmute [user] [time] (reason)`")
            return
        }
        time = ms(time)
        if (!time) {
            error(message, "Tempo non valido", "`!tempmute [user] [time] (reason)`")
            return
        }

        var ruoloTempmuted = message.guild.roles.cache.find(role => role.id == config.ruoliModeration.tempmuted);
        message.guild.channels.cache.forEach((canale) => {
            if (canale.id != config.idCanaliServer.tempmutedTicket) {
                canale.updateOverwrite(ruoloTempmuted, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SPEAK: false
                })
            }
        })

        utente.roles.add(ruoloTempmuted)
            .then(() => {
                if (utente.voice.channel) {
                    var canale = utente.voice.channelID
                    if (canale == config.idCanaliServer.general1)
                        utente.voice.setChannel(config.idCanaliServer.general2)
                    else
                        utente.voice.setChannel(config.idCanaliServer.general1)
                    utente.voice.setChannel(canale)
                }
            })

        userstats.moderation = {
            "type": "Tempmuted",
            "since": new Date().getTime(),
            "until": moment(new Date().getTime()).add(time, "ms").valueOf(),
            "reason": reason,
            "moderator": message.author.username
        }

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

        var embed = new Discord.MessageEmbed()
            .setAuthor("[TEMPMUTE] " + utente.user.tag, utente.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://i.postimg.cc/bJPt919L/Giulio-Ban-copia-2.png")
            .setColor("#6143CB")
            .addField("Reason", reason)
            .addField("Time", ms(time, { long: true }))
            .addField("Moderator", message.author.toString())
            .setFooter("User ID: " + utente.user.id)

        message.channel.send(embed)

        var canale = client.channels.cache.get(config.idCanaliServer.log);
        canale.send(embed);

        var embedUtente = new Discord.MessageEmbed()
            .setTitle("Sei stato mutato temporaneamente")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/bJPt919L/Giulio-Ban-copia-2.png")
            .addField("Reason", reason)
            .addField("Time", ms(time, { long: true }))
            .addField("Moderator", message.author.toString())

        utente.send(embedUtente).catch(() => {
            return
        })
    },
};
