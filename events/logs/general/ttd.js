module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (isMaintenance(message.author.id)) return

        if (message.author.bot) return

        if (message.channel.id != log.general.thingsToDo) return

        if (message.reference) return

        var embed = new Discord.MessageEmbed()
            .addField("Status", "⚪ Uncompleted")
            .addField("Thing to do...", message.content, true)
            .setColor("#E6E7E8")

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

        message.channel.send({ embeds: [embed], components: [row] })
        message.delete()
            .catch(() => { })
    },
};