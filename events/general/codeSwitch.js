module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (!button.id.startsWith("codeSwitch")) return

        button.reply.defer()

        if (isMaintenance(button.clicker.user.id)) return

        if (button.id.split(",")[1] != button.clicker.user.id) return

        var version = button.id.split(",")[3];

        if (button.message.embeds[0].description.endsWith("_Version: `Discord.js v" + version + "`_")) return

        var codice = client.codes.find(cmd => cmd.id == button.id.split(",")[2]);

        var embed = new Discord.MessageEmbed()
            .setTitle(`${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""} ${codice.name.toUpperCase()} ${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""}`)
            .setDescription(codice.description + "\r_Version: `Discord.js v" + version + "`_")
            .setFooter("Seleziona la versione di Discord.js con i bottoni qua sotto")

        if (codice.video)
            embed
                .addField(":video_camera: Video", `Guarda il video su YouTube di Giulio per maggiori info ([Clicca qui](${codice.video}))`)

        if (codice.info)
            embed.addField(":name_badge: Info - Leggere attentamente", codice.info)

        var button1 = new disbut.MessageButton()
            .setLabel("v12")
            .setID(`codeSwitch,${button.clicker.user.id},${codice.id},12`)
            .setStyle(version == "12" ? "blurple" : "gray")

        var button2 = new disbut.MessageButton()
            .setLabel("v13")
            .setID(`codeSwitch,${button.clicker.user.id},${codice.id},13`)
            .setStyle(version == "13" ? "blurple" : "gray")

        var button3 = new disbut.MessageButton()
            .setLabel("Ottieni codice completo")
            .setID(`codeCompleto,${button.clicker.user.id},${codice.id},${version}`)
            .setStyle("green")

        var row = new disbut.MessageActionRow()
            .addComponent(button1)
            .addComponent(button2)

        var codeText = ""
        var codeSplit = codice["v" + version].trim().split("\n")
        var tooLong = false

        codeSplit.forEach(row => {
            if ((codeText + row + 2).length > 1014)
                tooLong = true
            else if (!tooLong)
                codeText += row + "\r"
        })

        embed
            .addField(":wrench: Code:", "```js\r" + codeText + "```")

        if (tooLong) {
            embed.addField(":warning: Il codice è troppo lungo", "Ottieni il codice completo con il pulsante **\"Ottieni codice completo\"**")
            row.addComponent(button3)
        }

        button.message.edit(embed, row)
    },
};
