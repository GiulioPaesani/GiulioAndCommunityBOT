module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (!button.id.startsWith("avantiInfractions")) return

        if (isMaintenance(button.clicker.user.id)) return

        if (button.id.split(",")[1] != button.clicker.user.id) return

        var userstats = userstatsList.find(x => x.id == button.id.split(",")[3]);
        if (!userstats) return

        var warn = userstats.warn;

        var page = parseInt(button.id.split(",")[2])
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

        var button1 = new disbut.MessageButton()
            .setID(`indietroInfractions,${button.clicker.user.id},${page},${userstats.id}`)
            .setStyle("blurple")
            .setEmoji("◀️")

        if (page == 0)
            button1.setDisabled()

        var button2 = new disbut.MessageButton()
            .setID(`avantiInfractions,${button.clicker.user.id},${page},${userstats.id}`)
            .setStyle("blurple")
            .setEmoji("▶️")

        if (page == totalPage - 1)
            button2.setDisabled()

        var row = new disbut.MessageActionRow()

        if (totalPage != 1)
            row
                .addComponent(button1)
                .addComponent(button2)

        button.message.edit(button.message.embeds[0], row)
    },
};