module.exports = {
    name: `messageUpdate`,
    async execute(oldMessage, newMessage) {
        if (!newMessage.author) return
        if (newMessage.author.bot) return
        if (utenteMod(newMessage.member)) return

        [trovata, nonCensurato, censurato] = getParolaccia(newMessage.content);

        if (!trovata) return

        newMessage.delete()
            .catch(() => { })

        var userstats = userstatsList.find(x => x.id == newMessage.author.id);
        if (!userstats) return

        userstats.warn[userstats.warn.length] = {
            reason: "Bad word",
            time: new Date().getTime()
        }

        var embed = new Discord.MessageEmbed()
            .setAuthor("[BAD WORD] " + newMessage.member.user.tag, newMessage.member.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://i.postimg.cc/j2dnGK97/Giulio-Ban-copia-4.png")
            .setColor("#6143CB")
            .addField("Message edit", censurato)
            .addField("Channel", newMessage.channel.toString())
            .setFooter("User ID: " + newMessage.member.user.id)

        newMessage.channel.send(embed)

        var embedLog = new Discord.MessageEmbed()
            .setAuthor("[BAD WORD] " + newMessage.member.user.tag, newMessage.member.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://i.postimg.cc/j2dnGK97/Giulio-Ban-copia-4.png")
            .setColor("#6143CB")
            .addField("Message edit", nonCensurato)
            .addField("Channel", newMessage.channel.toString())
            .setFooter("User ID: " + newMessage.member.user.id)

        var canale = client.channels.cache.get(config.idCanaliServer.log)
        canale.send(embedLog)

        var embedUtente = new Discord.MessageEmbed()
            .setTitle("Hai detto una parolaccia")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/j2dnGK97/Giulio-Ban-copia-4.png")
            .addField("Message edit", censurato)
            .addField("Channel", newMessage.channel.toString())

        newMessage.member.send(embedUtente)
            .catch(() => { })

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
    },
};