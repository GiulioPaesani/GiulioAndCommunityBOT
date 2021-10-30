module.exports = {
    name: `message`,
    async execute(message) {
        if (message.author.bot) return
        if (message.channel.type == "dm") return
        if (message.guild.id != config.idServer) return
        if (utenteMod(message.member)) return
        if (!userstatsList) return

        [trovata, nonCensurato, censurato] = getParolaccia(message.content);

        if (!trovata) return

        message.delete()
            .catch(() => { })

        var userstats = userstatsList.find(x => x.id == message.author.id);
        if (!userstats) return

        userstats.warn[userstats.warn.length] = {
            reason: "Bad word",
            time: new Date().getTime()
        }

        var embed = new Discord.MessageEmbed()
            .setAuthor("[BAD WORD] " + message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://i.postimg.cc/j2dnGK97/Giulio-Ban-copia-4.png")
            .setColor("#6143CB")
            .addField("Message", censurato)
            .addField("Channel", message.channel.toString())
            .setFooter("User ID: " + message.member.user.id)

        message.channel.send(embed)

        var embedLog = new Discord.MessageEmbed()
            .setAuthor("[BAD WORD] " + message.member.user.tag, message.member.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://i.postimg.cc/j2dnGK97/Giulio-Ban-copia-4.png")
            .setColor("#6143CB")
            .addField("Message", nonCensurato)
            .addField("Channel", message.channel.toString())
            .setFooter("User ID: " + message.member.user.id)

        var canale = client.channels.cache.get(config.idCanaliServer.log)
        canale.send(embedLog)

        var embedUtente = new Discord.MessageEmbed()
            .setTitle("Hai detto una parolaccia")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/j2dnGK97/Giulio-Ban-copia-4.png")
            .addField("Message", censurato)
            .addField("Channel", message.channel.toString())

        message.member.send(embedUtente)
            .catch(() => { })

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
    },
};