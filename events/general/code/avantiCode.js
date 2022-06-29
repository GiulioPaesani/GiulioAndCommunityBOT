const Discord = require("discord.js")
const { isMaintenance } = require("../../../functions/general/isMaintenance")
const { getEmoji } = require("../../../functions/general/getEmoji")
const { replyMessage } = require("../../../functions/general/replyMessage");

module.exports = {
    name: `interactionCreate`,
    async execute(client, interaction) {
        if (!interaction.isButton()) return
        if (!interaction.customId.startsWith("avantiCode")) return

        await interaction.deferUpdate().catch(() => { })

        const maintenanceStatus = await isMaintenance(interaction.user.id)
        if (maintenanceStatus) return

        if (interaction.customId.split(",")[1] != interaction.user.id) return replyMessage(client, interaction, "Warning", "Bottone non tuo", "Questo bottone è in un comando eseguito da un'altra persona, esegui anche tu il comando per poterlo premere")

        let category = interaction.customId.split(",")[3]
        let select = new Discord.MessageSelectMenu()
            .setCustomId(`codeMenu,${interaction.user.id}`)
            .setPlaceholder('Select category...')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions({
                label: "Utility",
                emoji: "🧰",
                value: "codeUtility",
            })
            .addOptions({
                label: "Moderation",
                emoji: "🔨",
                value: "codeModeration",
            })
            .addOptions({
                label: "Altri comandi",
                emoji: "🎡",
                value: "codeCommands",
            })
            .addOptions({
                label: "Fun",
                emoji: "🤣",
                value: "codeFun",
            })
            .addOptions({
                label: "Gestione messaggi/canali/ruoli/utenti",
                emoji: "📁",
                value: "codeManage",
            })
            .addOptions({
                label: "Errori comuni",
                emoji: "🚫",
                value: "codeErrors",
            })

        let row = new Discord.MessageActionRow()
            .addComponents(select)

        let embed = new Discord.MessageEmbed()
            .setDescription("Per potere ottenere il **codice** e la **spiegazione** delle funzioni qua sotto utilizza il command `/code [id]`")

        switch (category) {
            case "utility": {
                embed
                    .setTitle("🧰 UTILITY codes 🧰")
                    .setColor("#CA253B")
            } break
            case "moderation": {
                embed
                    .setTitle("🔨 MODERATION codes 🔨")
                    .setColor("#5E666A")
            } break
            case "commands": {
                embed
                    .setTitle("🎡 COMMANDS codes 🎡")
                    .setColor("#A98ED0")
            } break
            case "fun": {
                embed
                    .setTitle("😂 FUN codes 😂")
                    .setColor("#F0C048")
            } break
            case "manage": {
                embed
                    .setTitle("📁 MANAGING codes 📁")
                    .setColor("#53A9E9")
            } break
            case "errors": {
                embed
                    .setTitle("🚫 ERRORS codes 🚫")
                    .setColor("#B82E40")
            } break
        }

        let row2 = new Discord.MessageActionRow()
        let codes = [...client.codes.filter(x => x.category == category).map(x => x)]

        let totPage = Math.ceil(codes.length / 5)
        let page = parseInt(interaction.customId.split(",")[2]) + 1
        if (page > totPage) page = totPage

        for (let i = 5 * (page - 1); i < 5 * page; i++) {
            if (codes[i]) {
                embed
                    .addField(`${codes[i].name}`, `
${codes[i].description}
`, false)
            }
        }

        let button1 = new Discord.MessageButton()
            .setCustomId(`indietroCode,${interaction.user.id},${page},${category}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Previous"))

        if (page == 1) {
            button1.setDisabled()
        }

        let button2 = new Discord.MessageButton()
            .setCustomId(`avantiCode,${interaction.user.id},${page},${category}`)
            .setStyle("PRIMARY")
            .setEmoji(getEmoji(client, "Next"))

        if (page == totPage) {
            button2.setDisabled()
        }

        row2
            .addComponents(button1)
            .addComponents(button2)

        if (totPage > 1)
            embed.setFooter({ text: `Page ${page}/${totPage}` })

        interaction.message.edit({ embeds: [embed], components: category ? [row2, row] : [row] })
    },
};