module.exports = {
    name: "warn",
    aliases: [],
    onlyStaff: true,
    channelsGranted: [],
    async execute(message, args, client) {
        var utente = message.mentions.members.first()
        if (!utente) {
            var utente = message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(user => user.user.username.toLowerCase() == args[0]) || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args[0]) || message.guild.members.cache.find(user => user.nickname && user.nickname.toLowerCase() == args[0])
        }

        if (!utente) {
            error(message, "Utente non trovato", "`!warn [user] (reason)`")
            return
        }

        if (utenteMod(utente)) {
            var embed = new Discord.MessageEmbed()
                .setTitle("Non hai il permesso")
                .setColor("#9E005D")
                .setDescription("Non puoi warnare questo utente")

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

        var reason = args.slice(1).join(" ");

        if (!reason) {
            reason = "Nessun motivo";
        }

        userstats.warn[userstats.warn.length] = {
            reason: reason,
            time: new Date().getTime(),
            moderator: message.author.username
        }

        var embed = new Discord.MessageEmbed()
            .setAuthor("[WARN] " + utente.user.tag, utente.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://i.postimg.cc/j2dnGK97/Giulio-Ban-copia-4.png")
            .setColor("#6143CB")
            .addField("Reason", reason)
            .addField("Moderator", message.author.toString())
            .setFooter("User ID: " + utente.user.id)

        message.channel.send(embed)

        var embedUtente = new Discord.MessageEmbed()
            .setTitle("Sei stato warnato")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/j2dnGK97/Giulio-Ban-copia-4.png")
            .addField("Reason", reason)
            .addField("Moderator", message.author.toString())

        utente.send(embedUtente)
            .catch(() => {
                return
            })

        var canale = client.channels.cache.get(config.idCanaliServer.log);
        canale.send(embed)

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
    },
};
