module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (isMaintenance(message.author.id)) return

        if (message.author.bot) return
        if (message.channel.id != log.general.thingsToDo) return

        if (!message.reference) return

        message.delete()
            .catch(() => { })

        client.channels.cache.get(log.general.thingsToDo).messages.fetch(message.reference.messageId)
            .then(msg => {
                if (!msg.embeds[0]) return

                const args = message.content.split(/ +/);
                var ttd = args.join(" ");
                if (!ttd) return

                var select = new Discord.MessageSelectMenu()
                    .setCustomId('ttdMenu')
                    .setPlaceholder('Select status...')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions({
                        label: "Uncompleted",
                        emoji: "⚪",
                        value: "ttdWhite",
                        description: "Thing to do non ancora completata"
                    })
                    .addOptions({
                        label: "Urgent",
                        emoji: "🔴",
                        value: "ttdRed",
                        description: "Thing to do urgente da realizzare"
                    })
                    .addOptions({
                        label: "Completed",
                        emoji: "🟢",
                        value: "ttdGreen",
                        description: "Thing to do completata"
                    })
                    .addOptions({
                        label: "Tested",
                        emoji: "🔵",
                        value: "ttdBlue",
                        description: "Thing to do testata e funzionante"
                    })
                    .addOptions({
                        label: "Finished",
                        emoji: "⚫",
                        value: "ttdBlack",
                        description: "Thing to do terminata"
                    })
                    .addOptions({
                        label: "Delete",
                        emoji: "❌",
                        value: "ttdDelete",
                        description: "Elimina Thing to do"
                    })

                var row = new Discord.MessageActionRow()
                    .addComponents(select)

                msg.embeds[0].fields[1].value = ttd
                msg.edit({ embeds: [msg.embeds[0]], components: [row] })
            })
    },
};