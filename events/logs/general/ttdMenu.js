module.exports = {
    name: `interactionCreate`,
    async execute(menu) {
        if (!menu.isSelectMenu()) return
        if (menu.customId != "ttdMenu") return

        if (isMaintenance(menu.user.id)) return

        menu.deferUpdate()

        var embed = menu.message.embeds[0]

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

        switch (menu.values[0]) {
            case "ttdWhite": {
                embed.fields[0].value = "⚪ Uncompleted";
                embed.color = "#E6E7E8"
            } break
            case "ttdRed": {
                embed.fields[0].value = "🔴 Urgent";
                embed.color = "#DD2E44"
            } break
            case "ttdGreen": {
                embed.fields[0].value = "🟢 Completed";
                embed.color = "#78B159"
            } break
            case "ttdBlue": {
                embed.fields[0].value = "🔵 Tested";
                embed.color = "#55ACEE"
            } break
            case "ttdBlack": {
                embed.fields[0].value = "⚫ Finished";
                embed.color = "#31373D"
            } break
            case "ttdDelete": {
                menu.message.delete()
                    .catch(() => { })
                return
            } break
        }
        menu.message.edit({ embeds: [embed], components: [row] })
    },
};