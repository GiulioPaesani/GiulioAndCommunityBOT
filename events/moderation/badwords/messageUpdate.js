module.exports = {
    name: `messageUpdate`,
    async execute(oldMessage, newMessage) {
        if (!newMessage) return
        if (!newMessage.author) return

        if (isMaintenance(newMessage.author.id)) return

        if (newMessage.channel.type == "DM") return
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
            .setThumbnail("https://i.postimg.cc/rm2MMHBv/Bad-words.png")
            .setColor("#6143CB")
            .addField("Message edit", censurato)
            .addField("Channel", newMessage.channel.toString())
            .setFooter("User ID: " + newMessage.member.user.id)

        newMessage.channel.send({ embeds: [embed] })
            .then(msg => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(":sweat_drops: Badwords :sweat_drops:")
                    .setColor("#8227cc")
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(newMessage.author.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":bust_in_silhouette: Member", `${newMessage.author.toString()} - ID: ${newMessage.author.id}`, false)
                    .addField("Channel", `#${newMessage.channel.name}`, false)
                    .addField("Message edit", `
Old: ${oldMessage.content.length > 500 ? `${oldMessage.content.slice(0, 497)}...` : oldMessage.content}
New: ${nonCensurato.length > 500 ? `${nonCensurato.slice(0, 497)}...` : nonCensurato}`, false)

                if (!isMaintenance())
                    client.channels.cache.get(log.moderation.badwords).send({ embeds: [embed] })
            })

        var embed = new Discord.MessageEmbed()
            .setTitle("Hai detto una parolaccia")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/rm2MMHBv/Bad-words.png")
            .addField("Message edit", censurato)
            .addField("Channel", newMessage.channel.toString())

        newMessage.member.send({ embeds: [embed] })
            .catch(() => { })

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats
    },
};