module.exports = {
    name: `message`,
    async execute(message) {
        if (message.author.bot) return
        if (message.channel.type == "dm") return
        if (message.channel.id != log.dm) return

        message.delete()
            .catch(() => { })

        if (!message.reference) return

        if (!message.content) return

        client.channels.cache.get(log.dm).messages.fetch(message.reference.messageID)
            .then(msg => {
                var idUtente = msg.embeds[0].fields[0].value.slice(msg.embeds[0].fields[0].value.length - 22, -4)
                if (!idUtente) return

                var utente = client.users.cache.get(idUtente)
                if (!utente) return

                var embed = new Discord.MessageEmbed()
                    .setTitle(":page_facing_up: New message :page_facing_up:")
                    .setDescription(`**${message.author.username}** ti ha scritto attraverso il bot, per un messaggio che hai inviato`)
                    .addField(":outbox_tray: Your message", ((msg.embeds[0].fields[2].value == "```None```" && msg.embeds[0].fields[3]) ? msg.embeds[0].fields[3].value : msg.embeds[0].fields[2].value))
                    .addField(":inbox_tray: Response", "```" + message.content.slice(0, 900) + "```")

                utente.send(embed)
                    .then(() => {
                        var embed = new Discord.MessageEmbed()
                            .setTitle(":outbox_tray: DM Response :outbox_tray:")
                            .setColor("#D72D42")
                            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                            .addField(":shield: Moderator", "```" + message.author.username + "```")
                            .addField(":alarm_clock: Time", "```" + moment(new Date().getTime()).format("ddd DD MMM, HH:mm") + "```")
                            .addField(":keyboard: Content", "```" + message.content.slice(0, 900) + "```")
                            .addField(":bust_in_silhouette: Response to", "```" + `${utente.username} (ID: ${utente.id})` + "```[Message](https://discord.com/channels/" + log.server + "/" + log.dm + "/" + msg.id + ")")

                        client.channels.cache.get(log.dm).send(embed)
                    })
                    .catch(() => {
                        error(message, "Dm bloccati", "Questo utente ha i dm chiusi")
                        return
                    })
            })
    },
};