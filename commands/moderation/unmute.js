module.exports = {
    name: "unmute",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {
        var utente = message.mentions.members.first()
        if (!utente) {
            var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args.join(" ")) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args.join(" "))
        }

        if (!utente) {
            error(message, "Utente non trovato", "`!unmute [user]`")
            return
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return

        if (userstats.moderation.type == "") {
            warning(message, "Utente non mutato", "Questo utente non è mutato")
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

        var ruoloMuted = message.guild.roles.cache.find(role => role.id == config.ruoliModeration.muted);
        var ruoloTempmuted = message.guild.roles.cache.find(role => role.id == config.ruoliModeration.tempmuted);

        utente.roles.remove(ruoloMuted);
        utente.roles.remove(ruoloTempmuted)
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


        var embed = new Discord.MessageEmbed()
            .setAuthor("[UNMUTE] " + utente.user.tag, utente.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://i.postimg.cc/bJPt919L/Giulio-Ban-copia-2.png")
            .setColor("#6143CB")
            .addField("Moderator", message.author.toString())
            .addField("Time muted", ms(new Date().getTime() - userstats.moderation.since, { long: true }))
            .setFooter("User ID: " + utente.user.id)

        message.channel.send(embed)

        var canale = client.channels.cache.get(config.idCanaliServer.log);
        canale.send(embed);

        var embedUtente = new Discord.MessageEmbed()
            .setTitle("Sei stato smutato")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/bJPt919L/Giulio-Ban-copia-2.png")
            .addField("Moderator", message.author.toString())
            .addField("Time muted", ms(new Date().getTime() - userstats.moderation.since, { long: true }))

        utente.send(embedUtente).catch(() => {
            return
        })

        userstats.moderation = {
            "type": "",
            "since": "",
            "until": "",
            "reason": "",
            "moderator": ""
        }

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
    },
};
