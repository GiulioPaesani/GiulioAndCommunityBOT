module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (!button.id.startsWith("fban")) return

        button.reply.defer().catch(() => { })

        if (isMaintenance(button.clicker.user.id)) return

        if (button.id.split(",")[1] != button.clicker.user.id) return

        var utente = button.message.guild.members.cache.find(x => x.id == button.id.split(",")[2])
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
            utente.roles.remove(settings.ruoliModeration.tempmuted)
            utente.roles.remove(settings.ruoliModeration.muted)
            utente.roles.remove(settings.ruoliModeration.banned)
            utente.roles.remove(settings.ruoliModeration.tempbanned)
        }

        userstats.moderation = {
            "type": "ForceBanned",
            "since": new Date().getTime(),
            "until": "",
            "reason": button.id.split(",")[3],
            "moderator": button.clicker.user.username,
            "ticketOpened": false
        }

        userstatsList[userstatsList.findIndex(x => x.id == userstats.id)] = userstats

        if (utente.user) utente = utente.user

        var embed = new Discord.MessageEmbed()
            .setAuthor("[FORCE BAN] " + utente.tag, utente.displayAvatarURL({ dynamic: true }))
            .setThumbnail("https://i.postimg.cc/j56K5XKC/Ban.png")
            .setColor("#6143CB")
            .addField("Reason", button.id.split(",")[3])
            .addField("Moderator", button.clicker.user.toString())
            .setFooter("User ID: " + utente.id)

        button.message.channel.send(embed)
            .then(msg => {
                var embed = new Discord.MessageEmbed()
                    .setTitle(":no_entry: Forceban :no_entry:")
                    .setColor("#8227cc")
                    .setDescription(`[Message link](https://discord.com/channels/${msg.guild.id}/${msg.channel.id}/${msg.id})`)
                    .setThumbnail(utente.displayAvatarURL({ dynamic: true }))
                    .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                    .addField(":brain: Executor", `${button.clicker.user.toString()} - ID: ${button.clicker.user.id}`, false)
                    .addField(":bust_in_silhouette: Member", `${utente.toString()} - ID: ${utente.id}`, false)
                    .addField("Reason", button.id.split(",")[3], false)

                if (!isMaintenance())
                    client.channels.cache.get(log.moderation.forceban).send(embed)
            })

        var embedUtente = new Discord.MessageEmbed()
            .setTitle("Sei stato bannato forzatamente")
            .setColor("#6143CB")
            .setThumbnail("https://i.postimg.cc/j56K5XKC/Ban.png")
            .addField("Reason", button.id.split(",")[3])
            .addField("Moderator", button.clicker.user.toString())

        utente.send(embedUtente)
            .catch(() => {
                return
            })

        button.message.guild.members.ban(utente.id, { reason: reason })
    },
};