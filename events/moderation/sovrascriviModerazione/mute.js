module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (!button.customId.startsWith("mute")) return

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
                if (canale.parentId != settings.idCanaliServer.categoriaModerationTicket) {
                    canale.permissionOverwrites.edit(settings.ruoliModeration.muted, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        SPEAK: false
                    })
                }
            })

            utente.roles.remove(settings.ruoliModeration.tempmuted)
            utente.roles.remove(settings.ruoliModeration.banned)
            utente.roles.remove(settings.ruoliModeration.tempbanned)

            utente.roles.add(settings.ruoliModeration.muted)
                .then(() => {
                    if (utente.voice?.channel) {
                        var canale = utente.voice.channelId
                        if (canale == settings.idCanaliServer.general1)
                            utente.voice.setChannel(settings.idCanaliServer.general2)
                        else
                            utente.voice.setChannel(settings.idCanaliServer.general1)
                        utente.voice.setChannel(canale)
                    }
                })
        }

        userstats.moderation = {
            "type": "Muted",
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
            .setAuthor("[MUTE] " + utente.tag, utente.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://i.postimg.cc/gjYp6Zks/Mute.png")
            .setColor("#6143CB")
            .addField("Reason", button.customId.split(",")[3])
            .addField("Moderator", button.user.toString())
            .setFooter("User ID: " + utente.id)

        button.message.channel.send({ embeds: [embed] })
            .then(msg => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(":speaker: Mute :speaker:")
                    .setColor("#8227cc")
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${button.user.toString()} - ID: ${button.user.id}`, false)
                    .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`, false)
                    .addField("Reason", button.customId.split(",")[3], false)

                if (!isMaintenance())
                    client.channels.cache.get(log.moderation.mute).send({ embeds: [embed] })
            })

        var embed = new Discord.MessageEmbed()
            .setTitle("Sei stato mutato")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/gjYp6Zks/Mute.png")
            .addField("Reason", button.customId.split(",")[3])
            .addField("Moderator", button.user.toString())

        utente.send({ embeds: [embed] }).catch(() => {
            return
        })
    },
};