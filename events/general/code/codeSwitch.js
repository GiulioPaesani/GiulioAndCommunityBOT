const Discord = require("discord.js")
const { isMaintenance } = require("../../../functions/general/isMaintenance")

module.exports = {
    name: `interactionCreate`,
    client: "general",
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("codeSwitch")) return

        interaction.deferUpdate().catch(() => { })

        if (isMaintenance(interaction.user.id)) return

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let version = interaction.customId.split(",")[3];

        if (interaction.message.embeds[0].description.endsWith("_Version: `Discord.js v" + version + "`_")) return

        let codice = client.codes.find(cmd => cmd.id == interaction.customId.split(",")[2]);

        let embed = new Discord.MessageEmbed()
            .setTitle(`${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""} ${codice.name.toUpperCase()} ${codice.category == "commands" ? "🎡" : codice.category == "utility" ? "🧰" : codice.category == "moderation" ? "🔨" : codice.category == "fun" ? "🤣" : codice.category == "manage" ? "📁" : codice.category == "errors" ? "🚫" : ""}`)
            .setDescription(codice.description + "\n_Version: `Discord.js v" + version + "`_")
            .setFooter({ text: "Seleziona la versione di Discord.js con i bottoni qua sotto" })

        if (codice.video)
            embed
                .addField(":video_camera: Video", `Guarda il video su YouTube di Giulio per maggiori info ([Clicca qui](${codice.video}))`)

        if (codice.info)
            embed.addField(":name_badge: Info - Leggere attentamente", codice.info)

        let interaction1 = new Discord.MessageButton()
            .setLabel("v12")
            .setCustomId(`codeSwitch,${interaction.user.id},${codice.id},12`)
            .setStyle(version == "12" ? "PRIMARY" : "SECONDARY")

        let interaction2 = new Discord.MessageButton()
            .setLabel("v13")
            .setCustomId(`codeSwitch,${interaction.user.id},${codice.id},13`)
            .setStyle(version == "13" ? "PRIMARY" : "SECONDARY")

        let interaction3 = new Discord.MessageButton()
            .setLabel("Ottieni codice completo")
            .setCustomId(`codeCompleto,${codice.id},${version}`)
            .setStyle("SUCCESS")

        let row = new Discord.MessageActionRow()
            .addComponents(interaction1)
            .addComponents(interaction2)

        let codeText = ""
        let codeSplit = codice["v" + version].trim().split("\n")
        let tooLong = false

        codeSplit.forEach(row => {
            if ((codeText + row + 2).length > 1014)
                tooLong = true
            else if (!tooLong)
                codeText += row + "\n"
        })

        embed
            .addField(":wrench: Code:", "```js\n" + codeText + "```")

        if (tooLong) {
            embed.addField(":warning: Il codice è troppo lungo", "Ottieni il codice completo con il pulsante **\"Ottieni codice completo\"**")
            row.addComponents(interaction3)
        }

        interaction.message.edit({ embeds: [embed], components: [row] })
    },
};
