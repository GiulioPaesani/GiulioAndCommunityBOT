module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (isMaintenance(message.author.id)) return

        if (message.author.bot) return
        if (message.channel.type == "DM") return
        if (message.channel.id != log.general.bugReport) return

        message.delete()
            .catch(() => { })

        if (!message.reference) return

        if (!message.content) return

        client.channels.cache.get(log.general.bugReport).messages.fetch(message.reference.messageId)
            .then(msg => {
                if (msg.embeds[0]?.title != ":beetle: Bug report :beetle:") return

                var idUtente = msg.embeds[0].fields[1].value.slice(msg.embeds[0].fields[1].value.length - 19, -1)
                console.log(idUtente)
                if (!idUtente) return

                var utente = client.users.cache.get(idUtente)
                if (!utente) return

                if (utente.user) utente = utente.user

                var embed = new Discord.MessageEmbed()
                    .setTitle(":page_facing_up: New message :page_facing_up:")
                    .setColor("#6DA54C")
                    .setDescription(`**${message.author.username}** ti ha scritto attraverso il bot, per un bug che hai reportato`)
                    .addField(":beetle: Bug", `Text: ${msg.embeds[0].fields[2].value} - Attachments: ${msg.embeds[0].fields[3].value}`)
                    .addField(":inbox_tray: Response", message.content.slice(0, 1000))

                utente.send({ embeds: [embed] })
                    .catch(() => { })

                var embed = new Discord.MessageEmbed()
                    .setTitle(":outbox_tray: Bug Response :outbox_tray:")
                    .setColor("#D72D42")
                    .addField(":alarm_clock: Time", msg.embeds[0].fields[0].value, true)
                    .addField(":bust_in_silhouette: User", msg.embeds[0].fields[1].value, false)
                    .addField("Text", msg.embeds[0].fields[2].value)
                    .addField("Attachments", msg.embeds[0].fields[3].value)
                    .addField(`Response by ${message.author.username}`, message.content.slice(0, 1000))

                msg.edit({ embeds: [embed] })
            })
    },
};