module.exports = {
    name: `interactionCreate`,
    async execute(button) {
        if (!button.isButton()) return
        if (!button.customId.startsWith("codeSwitch")) return

        button.deferUpdate().catch(() => { })

        if (isMaintenance(button.user.id)) return

        if (button.customId.split(",")[1] != button.user.id) return

        var version = button.customId.split(",")[3];

        if (button.message.embeds[0].description.endsWith("_Version: `Discord.js v" + version + "`_")) return

        var codice = client.codes.find(cmd => cmd.id == button.customId.split(",")[2]);

        var embed = new Discord.MessageEmbed()
            .setTitle(`${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""} ${codice.name.toUpperCase()} ${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""}`)
            .setDescription(codice.description + "\r_Version: `Discord.js v" + version + "`_")
            .setFooter("Seleziona la versione di Discord.js con i bottoni qua sotto")

        if (codice.video)
            embed
                .addField(":video_camera: Video", `Guarda il video su YouTube di Giulio per maggiori info ([Clicca qui](${codice.video}))`)

        if (codice.info)
            embed.addField(":name_badge: Info - Leggere attentamente", codice.info)

        var button1 = new Discord.MessageButton()
            .setLabel("v12")
            .setCustomId(`codeSwitch,${button.user.id},${codice.id},12`)
            .setStyle(version == "12" ? "PRIMARY" : "SECONDARY")

        var button2 = new Discord.MessageButton()
            .setLabel("v13")
            .setCustomId(`codeSwitch,${button.user.id},${codice.id},13`)
            .setStyle(version == "13" ? "PRIMARY" : "SECONDARY")

        var button3 = new Discord.MessageButton()
            .setLabel("Ottieni codice completo")
            .setCustomId(`codeCompleto,${button.user.id},${codice.id},${version}`)
            .setStyle("SUCCESS")

        var row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

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
            row.addComponents(button3)
        }

        button.message.edit({ embeds: [embed], components: [row] })
    },
};
