module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (!button.customId.startsWith("avantiInfractions")) return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        if (button.customId.split(",")[1] != button.user.id) return

        var userstats = userstatsList.find(x => x.id == button.customId.split(",")[3]);
        if (!userstats) return

        var warn = userstats.warn;

        var page = parseInt(button.customId.split(",")[2])
        var totalPage = Math.ceil(warn.length / 10);

        page++
        if (page > totalPage) page = totalPage

        var elencoInfrazioni = ""
        for (var i = page * 10; i < (page * 10 + ((page * 10 + 10) > warn.length ? warn.length % 10 : 10)); i++) {
            elencoInfrazioni += `#${i + 1} - ${warn[i].reason} (${moment(warn[i].time).fromNow()})\r`
        }

        button.message.embeds[0].fields[button.message.embeds[0].fields.length == 4 ? 3 : 4].name = `:no_entry_sign: All infractions ${page + 1}/${totalPage}`
        button.message.embeds[0].fields[button.message.embeds[0].fields.length == 4 ? 3 : 4].value = "```" + elencoInfrazioni + "```"
        button.message.embeds[0].footer.text = `Page ${page + 1}/${totalPage}`

        var button1 = new Discord.MessageButton()
            .setCustomId(`indietroInfractions,${button.user.id},${page},${userstats.id}`)
            .setStyle("PRIMARY")
            .setEmoji("◀️")

        if (page == 0)
            button1.setDisabled()

        var button2 = new Discord.MessageButton()
            .setCustomId(`avantiInfractions,${button.user.id},${page},${userstats.id}`)
            .setStyle("PRIMARY")
            .setEmoji("▶️")

        if (page == totalPage - 1)
            button2.setDisabled()

        var row = new Discord.MessageActionRow()

        if (totalPage != 1)
            row
                .addComponents(button1)
                .addComponents(button2)

        button.message.edit({ embeds: [button.message.embeds[0]], components: [row] })
    },
};