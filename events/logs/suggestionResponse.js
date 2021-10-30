module.exports = {
    name: `message`,
    async execute(message) {
        if (message.author.bot) return
        if (message.channel.type == "dm") return
        if (message.channel.id != log.suggestions) return

        message.delete()
            .catch(() => { })

        if (!message.reference) return

        if (!message.content) return
        client.channels.cache.get(log.suggestions).messages.fetch(message.reference.messageID)
            .then(msg => {
                var idUtente = msg.embeds[0].fields[0].value.slice(msg.embeds[0].fields[0].value.length - 22, -4)
                if (!idUtente) return

                var utente = client.users.cache.get(idUtente)
                if (!utente) return

                if (msg.embeds[0].fields[1].value != "```Pending```") return

                if (msg.embeds[0].fields[3]) {
                    msg.embeds[0].fields[3].value = "```" + message.content.slice(0, 900) + "```"
                }
                else {
                    msg.embeds[0].fields.push({
                        name: `:outbox_tray: Response by ${message.author.username}`,
                        value: "```" + message.content.slice(0, 900) + "```",
                        inline: false
                    })
                }

                msg.embeds[0].fields[1].value = "```Refused by " + message.author.username + "```"
                msg.embeds[0].color = "15548997"

                msg.edit(msg.embeds[0], null)

                var embed = new Discord.MessageEmbed()
                    .setTitle("💡Suggestion RIFIUTATO")
                    .setColor("#ED4245")
                    .setDescription(`Un tuo suggerimento è stato purtroppo **rifiutato** dallo staff`)
                    .addField(":bookmark_tabs: Suggestion", msg.embeds[0].fields[2].value)
                    .addField(":inbox_tray: Message", `**${message.author.username}** ti ha lasciato un messaggio` + "```" + message.content.slice(0, 900) + "```")

                utente.send(embed)
                    .catch(() => { return })
            })
    },
};