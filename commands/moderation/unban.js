module.exports = {
    name: "unban",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {
        var utente = message.mentions.members.first()
        if (!utente) {
            var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args[0]) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args[0]) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args[0])
        }
        if (!utente) {
            var utente = client.users.cache.find(user => user.id == args[0])
        }

        if (!utente) {
            error(message, "Utente non trovato", "`!unban [user]`")
            return
        }

        var userstats = userstatsList.find(x => x.id == utente.id);
        if (!userstats) return

        if (userstats.moderation.type == "") {
            warning(message, "Utente non bannato", "Questo utente non è bannato")
            return
        }
        if (userstats.moderation.type == "Muted") {
            var embed = new Discord.MessageEmbed()
                .setTitle("Utente mutato")
                .setDescription("Questo utente è mutato")
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
                .setTitle("Utente tempmutato")
                .setDescription("Questo utente è mutato")
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

        message.guild.members.unban(utente.id).catch(() => { return })

        var ruoloBanned = message.guild.roles.cache.find(role => role.id == config.ruoliModeration.banned);
        var ruoloTempbanned = message.guild.roles.cache.find(role => role.id == config.ruoliModeration.tempbanned);

        if (utente.roles) {
            utente.roles.remove(ruoloBanned)
            utente.roles.remove(ruoloTempbanned)
            var embed = new Discord.MessageEmbed()
                .setAuthor("[UNBAN] " + utente.user.username + "#" + utente.user.discriminator, utente.user.displayAvatarURL({ dynamic: true }))
                .setThumbnail("https://i.postimg.cc/TwcW7hkx/Giulio-Ban-copia.png")
                .setColor("#6143CB")
                .addField("Moderator", message.author.toString())
                .addField("Time banned", ms(new Date().getTime() - userstats.moderation.since, { long: true }))
                .setFooter("User ID: " + utente.id)

            message.channel.send(embed)
        }
        else {
            var embed = new Discord.MessageEmbed()
                .setAuthor("[UNBAN] " + utente.username + "#" + utente.discriminator, utente.displayAvatarURL({ dynamic: true }))
                .setThumbnail("https://i.postimg.cc/TwcW7hkx/Giulio-Ban-copia.png")
                .setColor("#6143CB")
                .addField("Moderator", message.author.toString())
                .addField("Time banned", ms(new Date().getTime() - userstats.moderation.since, { long: true }))
                .setFooter("User ID: " + utente.id)

            message.channel.send(embed)
        }

        var embedUtente = new Discord.MessageEmbed()
            .setTitle("Sei stato sbannato")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/TwcW7hkx/Giulio-Ban-copia.png")
            .addField("Moderator", message.author.toString())
            .addField("Time banned", ms(new Date().getTime() - userstats.moderation.since, { long: true }))

        var canale = client.channels.cache.get(config.idCanaliServer.log);
        canale.send(embed)

        utente.send(embedUtente)
            .catch(() => {
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
