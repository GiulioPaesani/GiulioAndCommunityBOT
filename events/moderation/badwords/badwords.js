module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (isMaintenance(message.author.id)) return

        if (message.author.bot) return
        if (message.channel.type == "DM") return
        if (message.guild.id != settings.idServer) return
        if (utenteMod(message.author)) return
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
            .setThumbnail("https://i.postimg.cc/rm2MMHBv/Bad-words.png")
            .setColor("#6143CB")
            .addField("Message", censurato)
            .addField("Channel", message.channel.toString())
            .setFooter("User ID: " + message.member.user.id)

        message.channel.send({ embeds: [embed] })
            .then(msg => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(":sweat_drops: Badwords :sweat_drops:")
                    .setColor("#8227cc")
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":bust_in_silhouette: Member", `${message.author.toString()} - ID: ${message.author.id}`, false)
                    .addField("Channel", `#${message.channel.name}`, false)
                    .addField("Message", nonCensurato, false)

                if (!isMaintenance())
                    client.channels.cache.get(log.moderation.badwords).send({ embeds: [embed] })
            })

        var embed = new Discord.MessageEmbed()
            .setTitle("Hai detto una parolaccia")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/rm2MMHBv/Bad-words.png")
            .addField("Message", censurato)
            .addField("Channel", message.channel.toString())

        message.member.send({ embeds: [embed] })
            .catch(() => { })

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
    },
};