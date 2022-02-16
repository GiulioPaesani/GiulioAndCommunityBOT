module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (!button.customId.startsWith("ban")) return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        if (button.customId.split(",")[1] != button.user.id) return

        var utente = button.message.guild.members.cache.find(x => x.id == button.customId.split(",")[2])
        if (!utente) return

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

        if (button.message.guild.members.cache.find(x => x.id == utente.id)) {
            button.message.guild.channels.cache.forEach((canale) => {
                if (canale.parentId != settings.idCanaliServer.categoriaModerationTicket && canale.id != settings.idCanaliServer.rules) {
                    canale.permissionOverwrites.edit(settings.ruoliModeration.banned, {
                        VIEW_CHANNEL: false,
                        SPEAK: false
                    })
                }
            })

            utente.roles.remove(settings.ruoliModeration.tempmuted)
            utente.roles.remove(settings.ruoliModeration.muted)
            utente.roles.remove(settings.ruoliModeration.tempbanned)

            utente.roles.add(settings.ruoliModeration.banned)
                .then(() => {
                    if (utente.voice?.channel) {
                        utente.voice.kick();
                    }
                })
        }
        else {
            userstats.roles.push(settings.ruoliModeration.banned)
        }

        userstats.moderation = {
            "type": "Banned",
            "since": new Date().getTime(),
            "until": "",
            "reason": button.customId.split(",")[3],
            "moderator": button.user.username,
            "ticketOpened": false
        }

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

        if (utente.user) utente = utente.user

        button.message.delete()

        var embed = new Discord.MessageEmbed()
            .setAuthor("[BAN] " + utente.tag, utente.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://i.postimg.cc/j56K5XKC/Ban.png")
            .setColor("#6143CB")
            .addField("Reason", button.customId.split(",")[3])
            .addField("Moderator", button.user.toString())
            .setFooter("User ID: " + utente.id)

        button.message.channel.send({ embeds: [embed] })
            .then(msg => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(":o: Ban :o:")
                    .setColor("#8227cc")
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${button.user.toString()} - ID: ${button.user.id}`, false)
                    .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`, false)
                    .addField("Reason", button.customId.split(",")[3], false)

                if (!isMaintenance())
                    client.channels.cache.get(log.moderation.ban).send({ embeds: [embed] })
            })

        var embed = new Discord.MessageEmbed()
            .setTitle("Sei stato bannato")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/j56K5XKC/Ban.png")
            .addField("Reason", button.customId.split(",")[3])
            .addField("Moderator", button.user.toString())

        utente.send({ embeds: [embed] })
            .catch(() => {
                return
            })
    },
};